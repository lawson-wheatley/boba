from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from models import db
from flask import Flask, request, jsonify, make_response, g
from datetime import datetime, timedelta, timezone
from flask_migrate import Migrate
from flask_restful import Resource, wraps


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

@api.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    user = get_jwt_identity()
    posttext = request.json.get("text", None)
    title = request.json.get("title", None)
    post = Post()
    post.poster = user;
    post.posttitle = title;
    post.content = posttext;
    if 'file' not in request.files:
        return jsonify({"message" : "Posted!"}), 200
    f = request.files['file']
    if f.filename == '':
        return jsonify({"message" : "No file selected for uploading"}), 400
    if f and allowed_file(f.filename):
        val = os.path.splitext(f.name)
        full_final_name = str(uuid.uuid4()) + val[1]
        post_location = f"/storage/{full_final_name}"
        f.save(post_location)
        post.flocation = post_location
    comments = Comments()
    comments.post_id = post.id
    comments.post = post
    likes = Likes()
    likes.post_id = post.id
    likes.post = post
    db.session.add([post, comments, likes])
    db.session.commit()

    return jsonify({"message": "Unknown Error"}), 400

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
    

@api.route("/feed", methods = ["GET"])
@jwt_required()
def feed():
    current_user = get_jwt_identity()
    page = request.args.get("page")
    following = User.query.filter(User.id == current_user).first().following;
    posts = Post.query.filter(Post.poster.in_(following)).paginate(0, 25, False);
    return jsonify(posts), 200;

@api.route("/follow", methods=["POST"])
@jwt_required()
def follow():
    current_user = get_jwt_identity()
    to_follow = request.json.get("to_follow", None)
    user = User.query.filter(User.id == to_follow).first()
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