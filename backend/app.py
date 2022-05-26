from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from models import db
from flask import Flask, request, jsonify, make_response, g, send_from_directory
from datetime import datetime, timedelta, timezone
from PIL import Image
from flask_migrate import Migrate
from sqlalchemy import desc
from flask_restful import Resource, wraps
from flask_cors import CORS
from io import BytesIO
import base64


import hashlib, os, uuid, json

api = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
api.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'tmpdb.db')
api.config["JWT_SECRET_KEY"] = "12345678"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
db.init_app(api)
migrate = Migrate(api, db)
CORS(api)
with api.app_context():
    db.create_all()
from models import User, Comments, Comment, Likes, Like, Post, user_following, Community, user_moderating, user_following_community

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
        full_final_name = str(uuid.uuid4())
        post_location = os.path.join(f"{basedir}/storage/", full_final_name+".webp")
        missing_padding = len(file) % 4
        file = str.encode(file)
        if missing_padding:
            file += b'='* (4 - missing_padding)
        decoded = base64.decodebytes(file)
        image = Image.open(BytesIO(decoded))
        image.save(post_location, "webp")
        post.flocation = f"/storage/{full_final_name}.webp"
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

@api.route("/create-community", methods=["POST"])
@jwt_required()
def create_community():
    user = get_jwt_identity()
    community_name = request.json.get("community", None)
    community = Community.query.filter(Community.name == community_name).first()
    if community:
        return jsonify({"message":"community already created"}), 400
    community = Community()

    community.name = community_name
    user = User.query.filter(User.id == user).first()
    user.moderating.insert(user.id, community)
    db.session.add(community)
    db.session.commit()
    return jsonify({"message":"success!"}), 200

@api.route("/get-community/<id>")
@jwt_required(optional=True)
def getCommunity(id):
    user = get_jwt_identity()
    return jsonify(convert_community_to_json(id, user)), 200

def convert_community_to_json(community, user):       
    community = Community.query.filter(Community.name == community).first()
    if user:
        isModerating = User.query.filter(User.id == user).first().moderating
        isMod = community in isModerating
    else:
        isMod = False
    dic = {"name":community.name, "color": community.color, "picture":community.picture,"id":community.id, "isMod": f"{isMod}"}
    return dic

@api.route("/community/<id>/feed")
@jwt_required(optional=True)
def communityfeed(id):
    user = get_jwt_identity()
    pager = int(request.args.get("page")) + 1
    posts = Post.query.filter(Post.community == id).order_by(Post.timestamp.desc()).paginate(page=pager, max_per_page=15)
    print(posts.items)
    return jsonify({"has_next":posts.has_next, "posts":[convert_post_to_json(posts.items[i], user) for i in range(len(posts.items))]}), 200

@api.route("/modify-community-pic", methods=["POST"])
@jwt_required()
def modifycommunitypic():
    current_user = get_jwt_identity()
    file = request.json.get("file", None)
    fileName = request.json.get("filename", None)
    community = request.json.get("community", None)
    current_user = User.query.filter(User.id == current_user).first()
    community = Community.query.filter(Community.name == community).first()
    if community in current_user.moderating:
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
            community.picture = f"/storage/{full_final_name}"
            db.session.commit()
            return jsonify({"redirect":f"/profile/{community.name}"}), 200
    return jsonify({"message":"Error"}), 400

@api.route("/modify-community-color", methods=["POST"])
@jwt_required()
def modifycommunitycolor():
    current_user = get_jwt_identity()
    file = request.json.get("color", None)
    community = request.json.get("community", None)
    current_user = User.query.filter(User.id == current_user).first()
    community = Community.query.filter(Community.name == community).first()
    if community in current_user.moderating:
        community.color = file[1:]
        db.session.commit()
        return jsonify({"redirect":f"/profile/{community.name}"}), 200
    return jsonify({"message":"Error"}), 400

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
@jwt_required(optional=True)
def feed():
    current_user = get_jwt_identity()
    page = int(request.args.get("page"))+1
    print(page)
    posts = Post.query.order_by(Post.timestamp.desc()).paginate(page=page, max_per_page=15)
    print(posts.has_next)
    return jsonify({"has_next":posts.has_next, "posts":[convert_post_to_json(posts.items[i], current_user) for i in range(len(posts.items))]}), 200

def convert_post_to_json(post, usr):
    print(post.id)
    time = datetime.utcnow()
    tdelta = time-post.timestamp
    days, seconds = tdelta.days, tdelta.seconds
    foutput = ""
    if days == 0:
        hours = days * 24 + seconds // 3600
        if hours == 0:
            minutes = (seconds % 3600) // 60
            if minutes == 0:
                seconds = seconds % 60
                foutput = f"{seconds} seconds ago"
            elif minutes == 1:
                foutput = f"{minutes} minute ago"
            else:
                foutput = f"{minutes} minutes ago"
        elif hours == 1:
            foutput = f"{hours} hour ago"
        else:
            foutput = f"{hours} hours ago"
    elif days == 1:
        foutput = f"{days} day ago"
    else:
        foutput = f"{days} days ago"
    likes = Likes.query.filter(Likes.post_id == post.id).first()
    likeButton = False
    isLiked = False
    if usr:
        if likes.number != 0:
            isLiked = Like.query.filter(Like.likes_id == likes.id).filter(Like.owner == usr).first()
        if isLiked:
            likeButton = True
    poster = User.query.filter(User.id==post.poster).first()
    dic = {"flocation":post.flocation,
           "community":post.community,
           "content":post.content,
           "isliked": likeButton,
           "likes": likes.number,
           "id":post.id,
           "isText":post.isText,
           "poster": poster.username,
           "postppic": poster.picture,
           "title":post.posttitle,
           "timestamp":foutput}
    
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
    email = request.json.get("username", None)
    password = request.json.get("password", None)
    return create_token(email, password)

def create_token(email, password):
    user = User.query.filter(User.email==email).first()
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
@jwt_required(optional=True)
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

@api.route("/get-profile/<id>", methods=["GET"])
@jwt_required(optional=True)
def getProfile(id):
    usr = User.query.filter(User.username == id).first()
    return jsonify(getProfileInfo(usr)), 200

@api.route("/like", methods=["POST"])
@jwt_required()
def like():
    user = get_jwt_identity()
    post = request.json.get("id", None)
    likes = Likes.query.filter(Likes.post_id == post).first()
    checkIfLiked = Like.query.filter(Like.likes_id == likes.id)
    chk = False
    if checkIfLiked:
        chk = checkIfLiked.filter(Like.owner == user).first()
    if chk:
        db.session.delete(chk)
        likes.number = likes.number - 1
    else:
        like = Like()
        like.text = ""
        like.likes_id = likes.id
        like.owner = user
        if not likes.number:
            likes.number = 1
        else:
            likes.number = likes.number + 1
        db.session.add(like)
        likes.likm.insert(likes.id, like)

    db.session.commit()
    return jsonify({"message":"Liked"}), 200

@api.route("/bubbles", methods=["GET"])
def bubbles():
    #current_user = get_jwt_identity()
    communities = Community.query.paginate(0,25,False)
    return jsonify([convert_community_to_json_noauth(communities.items[i]) for i in range(len(communities.items))]), 200

def convert_community_to_json_noauth(community):
    dic = {"name":community.name, "color":community.color,"picture":community.picture,"id":community.id}
    return dic

@api.route("/search-communities", methods=["GET"])
def searchCommunities():
    qry = request.args.get("query", None)
    communities = Community.query.filter(Community.name.contains(qry)).limit(5).all()
    return jsonify([communities[i].name for i in range(len(communities))]), 200

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
        return jsonify({"redirect":f"/profile/{usr.username}"}), 200
    return jsonify({"message":"Error"}), 400

@api.route("/profile/<id>/feed", methods=["GET"])
@jwt_required(optional=True)
def getFeed(id):
    user = get_jwt_identity()
    usr = User.query.filter(User.username == id).first()
    page = int(request.args.get("page")) + 1
    posts = Post.query.filter(Post.poster == usr.id).order_by(Post.timestamp.desc()).paginate(page=page, max_per_page=15)
    return jsonify({"has_next":posts.has_next, "posts":[convert_post_to_json(posts.items[i], user) for i in range(len(posts.items))]}), 200

def getProfileInfo(profile):
    dic = {"username":profile.username,"displayname":profile.displayName, "joined":profile.joined, "picture":profile.picture}
    return dic

@api.route("/post/<idd>", methods=["GET"])
@jwt_required(optional=True)
def get_post(idd):
    ret = Post.query.filter(Post.id == idd).first();
    if ret:
        return jsonify(convert_post_to_json(ret, get_jwt_identity())), 200
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