from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from models import db
from flask import Flask, request, jsonify, make_response, g, send_from_directory
from datetime import datetime, timedelta, timezone
from flask_migrate import Migrate
from flask_restful import Resource, wraps
import base64


import hashlib, os, uuid, json

api = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
api.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'tmpdb.db')
api.config["JWT_SECRET_KEY"] = "12345678"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
db.init_app(api)
migrate = Migrate(api, db)
with api.app_context():
    db.create_all()
from models import User, Comments, Comment, Likes, Like, Post, user_following

jwt = JWTManager(api)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'webp'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/storage/<id>")
def retFile(id):
    return send_from_directory('storage', id)
@api.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    print(request.json)
    user = get_jwt_identity()
    community = request.json.get("community", None)
    posttext = request.json.get("text", None)
    title = request.json.get("title", None)
    file = request.json.get("file", None)
    fileName = request.json.get("filename", None)
    post = Post()
    post.poster = user
    post.posttitle = title
    post.content = posttext
    if community:
        post.community = community
    if fileName == "":
        post.isText = True
        comments = Comments()
        comments.post_id = post.id
        comments.post = post
        likes = Likes()
        likes.post_id = post.id
        likes.post = post
        db.session.add(post)
        db.session.add(comments)
        db.session.add(likes)
        db.session.commit()
        return jsonify({"message" : "Posted!"}), 200
    
    if allowed_file(fileName):
        val = os.path.splitext(fileName)
        full_final_name = str(uuid.uuid4()) + val[1]
        post_location = os.path.join(f"{basedir}/storage/", full_final_name)
        missing_padding = len(file) % 4
        file = str.encode(file)
        if missing_padding:
            file += b'='* (4 - missing_padding)
        decoded = base64.decodebytes(file)
        with open(post_location, "wb") as fh:
            fh.write(decoded)
        post.flocation = f"/storage/{full_final_name}"
    post.isText = False
    comments = Comments()
    comments.post_id = post.id
    comments.post = post
    likes = Likes()
    likes.post_id = post.id
    likes.post = post
    db.session.add(post)
    db.session.add(comments)
    db.session.add(likes)
    db.session.commit()

    return jsonify({"message": "Completed"}), 200

@api.route("/comment", methods=["POST"])
@jwt_required()
def comment():
    user = get_jwt_identity()
    comment = request.json.get("comment", None)
    post = request.json.get("post", None)
    comments = Comments.query.filter(Comments.post_id == post).first()
    com = Comment()
    com.owner_id = user
    com.text = comment
    com.comments_id = comments.id
    com.comments = comments
    comments.coms.insert(com)
    db.session.commit()

@api.after_request
def refresh_expiring_jwt(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(hours = 3))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity = get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response
    
@api.route("/get-username", methods=["GET"])
@jwt_required()
def getUsername():
    current_user = get_jwt_identity()
    usr = User.query.filter(User.id == current_user).first()
    return jsonify(username=usr.username), 200

@api.route("/feed", methods = ["GET"])
@jwt_required()
def feed():
    current_user = get_jwt_identity()
    page = request.args.get("page")
    posts = Post.query.paginate(0, 25, False)
    print(posts.items[0].__dict__)
    return jsonify([convert_post_to_json(posts.items[i]) for i in range(len(posts.items))]), 200

def convert_post_to_json(post):
    dic = {"flocation":post.flocation,
           "community":post.community,
           "content":post.content,
           "id":post.id,
           "isText":post.isText,
           "poster":User.query.filter(User.id==post.poster).first().username,
           "title":post.posttitle,
           "timestamp":post.timestamp}
    
    return dic
@api.route("/follow", methods=["POST"])
@jwt_required()
def follow():
    current_user = get_jwt_identity()
    to_follow = request.json.get("to_follow", None)
    user = User.query.filter(User.username == to_follow).first()
    if not user:
        return jsonify({"message":"User not found"}), 400
    user.followers.insert(current_user)
    db.session.commit()


@api.route("/login", methods = ["POST","GET"])
def create_token():
    print(request.json)
    email = request.json.get("username", None)
    password = request.json.get("password", None)
    return create_token(email, password)

def create_token(email, password):
    user = User.query.filter(User.email==email).first()
    print(user)
    if checkPass(password, user.salt) != user.password:
        return {"msg":"incorrect email or password"}, 401
    access_token = create_access_token(identity = user.id)
    response = jsonify(access_token=access_token)
    return response

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg":"Logout successful"})
    unset_jwt_cookies(response)
    return response

@api.route("/post/<idd>/comments", methods=["GET"])
@jwt_required()
def postComments(idd):
    start = request.json.get("page", None)
    post = request.json.get("post", None)
    ret = Comment.query.filter(Comment.comments == Comments.query.filter(Comments.post_id == idd).first())
    if ret:
        ret.paginate(start,5,False)
        record_items = ret.items
        return jsonify({"comments":record_items}), 200
    else:
        return jsonify({"message":"Not found"}), 404

@api.route("/profile/<id>", methods=["GET"])
@jwt_required()
def getProfile(id):
    print("HUH")
    usr = User.query.filter(User.username == id).first()
    return jsonify(getProfileInfo(usr)), 200

@api.route("/modifyppic", methods=["POST"])
@jwt_required()
def modifyppic():
    current_user = get_jwt_identity()
    file = request.json.get("file", None)
    fileName = request.json.get("filename", None)
    usr = User.query.filter(User.id == current_user).first()
    if allowed_file(fileName):
        val = os.path.splitext(fileName)
        full_final_name = str(uuid.uuid4()) + val[1]
        post_location = os.path.join(f"{basedir}/storage/", full_final_name)
        missing_padding = len(file) % 4
        file = str.encode(file)
        if missing_padding:
            file += b'='* (4 - missing_padding)
        decoded = base64.decodebytes(file)
        with open(post_location, "wb") as fh:
            fh.write(decoded)
        usr.picture = f"/storage/{full_final_name}"
        db.session.commit()
        return {"redirect":f"/profile/{usr.username}"}, 200
    return {"message":"Error"}, 400

@api.route("/profile/<id>/feed", methods=["GET"])
@jwt_required()
def getFeed(id):
    usr = User.query.filter(User.username == id).first()
    page = request.args.get("page")
    posts = Post.query.filter(Post.poster == usr.id).paginate(0, 25, False)
    print(posts.items[0].__dict__)
    return jsonify([convert_post_to_json(posts.items[i]) for i in range(len(posts.items))]), 200

def getProfileInfo(profile):
    dic = {"username":profile.username,"displayname":profile.displayName, "joined":profile.joined, "picture":profile.picture}
    print(dic)
    return dic

@api.route("/post/<idd>", methods=["GET"])
@jwt_required()
def get_post(idd):
    ret = Post.query.filter(Post.id == idd).first()
    if ret:
        return jsonify(ret.items), 200
    return jsonify({"message":"Not found"}), 404

@api.route("/register", methods=["POST","GET"])
def register():
    print(request.json)
    dob = request.json.get("dob", None)
    username = request.json.get("username", None)
    email = request.json.get("email", None).lower()
    password = request.json.get("password", None)
    displayName = request.json.get("displayname", None)
    
    user = User.query.filter(User.email == email).first()
    if user:
        return jsonify({"message":"Email already in use"}), 400
    
    user = User()
    user.displayName = displayName
    user.username = username
    user.email = email
    passthesalt = hashPass(password=password)
    user.password = passthesalt[1]
    user.salt = passthesalt[0]
    user.last_login = datetime.now()
    user.joined = datetime.now()
    db.session.add(user)
    db.session.commit()
    return create_token(email, password)
    
def requires_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "id" not in g.cookie:
            return jsonify({"message":"No access allowed"}), 401
        g.user = User.query.get(g.cookie["id"])
        if not g.user:
            response = make_response("", 401)
            response.set_cookie("user", "")
            return response
        return func(*args, **kwargs)
    return wrapper
        
def decode_cookie():
    cookie = request.cookies.get("user")
    if not cookie:
        g.cookie = {}
        return
    try:
        g.cookie = jwt.decode(cookie, os.environ["SECRET_KEY"], algorithms=["HS256"])
    except jwt.InvalidTokenError as err:
        return jsonify({"message":"err401"}), 401

@api.route("/v1/modifyresource")
def modify():
    pass

def hashPass(password : str):
    salt = str(os.urandom(32))
    key = hashlib.pbkdf2_hmac('sha256', password.encode("UTF-8"), salt.encode(), 1000, dklen=128)
    return (salt, key)
    
def checkPass(password : str, salt: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode("UTF-8"), salt.encode(), 1000, dklen=128)


if __name__ == "__main__":
    api.run(debug=True, host="0.0.0.0", port=80)