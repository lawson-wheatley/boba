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
api.config["JWT_SECRET_KEY"] = "adfs0a9sdf9aklm"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=6)
db.init_app(api)

migrate = Migrate(api, db)
CORS(api)
with api.app_context():
    db.create_all()
from models import User, Like, Post, user_following, Community, user_moderating, user_following_community, Notification

jwt = JWTManager(api)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'webp'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/notifications")
@jwt_required()
def notifications():
    user = get_jwt_identity()
    page = request.args.get("page", None)
    notifications = Notification.query.filter(Notification.notifies == user).order_by(Notification.timestamp.desc())
    return jsonify([notification_to_json(notification) for notification in notifications]), 200

def notification_to_json(notification):
    user = User.query.filter(User.id == notification.notifier).first()
    post = Post.query.filter(Post.id == notification.post).first()
    if post.parent:
        type = "post"
    elif post.parent == -1:
        type= "story"
    else:
        type="comment"
    action = notification.action
    if action == "comment":
        comm = Post.query.filter(Post.id == notification.comment).first()
        if(comm != None):
            text = f" replied {comm.content}"
        else:
            text = f" replied..."
    else:
        text = f" liked your {type}"
    post = notification.post
    dic = {"notifier":user.username, 
           "pic":user.picture,
           "text": text,
           "on":notification.post}
    return dic

    
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
    print(request.json)
    post = Post()
    post.poster = user
    post.posttitle = title
    post.content = posttext
    if community:
        post.community = community
    if fileName == "":
        post.isText = True
        db.session.add(post)
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
    db.session.add(post)
    db.session.commit()
    print(post.id)
    return jsonify({"message": "Completed"}), 200

def story_to_json(post):
    foutput = tstamp_to_tsince(post.timestamp)
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

@api.route("/comment", methods=["POST"])
@jwt_required()
def comment():
    user = get_jwt_identity()
    print(request.json)
    comment = request.json.get("comment", None)
    post = request.json.get("post", None)
    ch = Post.query.filter(Post.id == post).first()
    print("HUH")
    if not ch:
        return jsonify({"message":"Post does not exist"}), 400
    com = Post()
    com.posttitle="7Zxgsf"
    com.isText = True
    com.content = comment
    com.poster = user
    com.parent = post
    db.session.add(com)
    db.session.commit()
    notif = Notification()
    notif.action="comment"
    notif.comment = com.id
    notif.notifier = user
    notif.notifies = Post.query.filter(Post.id == post).first().poster
    notif.post = post
    db.session.add(notif)
    db.session.commit()
    return jsonify({"message":"Comment successful!",}), 200

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
    community.picture = "/storage/boba.png"
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

@api.route("/stories", methods=["GET"])
@jwt_required()
def getStories():
    posts = Post.query.filter(Post.parent == -1).order_by(Post.timestamp.desc())
    return jsonify()
    pass

@api.route("/feed", methods = ["GET"])
@jwt_required(optional=True)
def feed():
    current_user = get_jwt_identity()
    page = int(request.args.get("page"))+1
    print(page)
    posts = Post.query.filter(Post.parent == None).order_by(Post.timestamp.desc()).paginate(page=page, max_per_page=15)
    return jsonify({"has_next":posts.has_next, "posts":[convert_post_to_json(posts.items[i], current_user) for i in range(len(posts.items))]}), 200

def convert_post_to_json(post, usr):
    print(post.id)
    print(post.parent)
    foutput = tstamp_to_tsince(post.timestamp)
    likeButton = False
    isLiked = False
    if usr:
        if len(post.likes) != 0:
            isLiked = Like.query.filter(Like.post == post.id).filter(Like.owner == usr).first()
        if isLiked:
            likeButton = True
    poster = User.query.filter(User.id==post.poster).first()
    dic = {"flocation":post.flocation,
           "community":post.community,
           "content":post.content,
           "isliked": likeButton,
           "likes": len(post.likes) if len(post.likes) else 0,
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
    checkIfLiked = Like.query.filter(Like.post == post)
    chk = False
    if checkIfLiked:
        chk = checkIfLiked.filter(Like.owner == user).first()
    if chk:
        print(chk)
        notif = Notification.query.filter(Notification.post == post).filter(Notification.action=="like").filter(Notification.notifier == user).first()
        print(notif)
        db.session.delete(notif)
        db.session.delete(chk)
    else:
        like = Like()
        like.text = ""
        like.post = post
        like.owner = user
        db.session.add(like)
        notif = Notification()
        notif.action="like"
        notif.like = like.id
        notif.notifier = user
        notif.notifies = Post.query.filter(Post.id == post).first().poster
        notif.post = post
        db.session.add(notif)

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
    page = int(request.args.get("page")) + 1
    pcx = User.query.filter(User.username == id).first().id
    posts = Post.query.filter(Post.poster == pcx).filter(Post.parent == None).order_by(Post.timestamp.desc()).paginate(page=page, max_per_page=15)
    return jsonify({"has_next":posts.has_next, "posts":[convert_post_to_json(posts.items[i], user) for i in range(len(posts.items))]}), 200

def getProfileInfo(profile):
    dic = {"username":profile.username,"displayname":profile.displayName, "joined":profile.joined, "picture":profile.picture}
    return dic

@api.route("/post/<idd>", methods=["GET"])
@jwt_required(optional=True)
def get_post(idd):
    ret = Post.query.filter(Post.id == idd).first()
    if ret:
        return jsonify(convert_post_to_json(ret, get_jwt_identity())), 200
    return jsonify({"message":"Not found"}), 404

@api.route("/post/<id>/comments", methods=["GET"])
@jwt_required(optional=True)
def getComments(id):
    print("HUH")
    ret = Post.query.filter(Post.id == id).first().commes
    current_user = get_jwt_identity()
    rev = [comment_to_json(comment, current_user, 3) for comment in ret]
    return jsonify(rev), 200

def comment_to_json(comment, usr, depth=3):
    """
    Display commment + subcomments in json
    {
        "comment":comment.id
        "author":comment.author
        "likes":comment.likes
        "isLiked":
        "isText":comment.isText
        [{sub_comment.id]
    }
    """
    foutput = tstamp_to_tsince(comment.timestamp)
    comms = []
    if comment.commes and depth != 0:
        for val in comment.commes:
            comms.append(comment_to_json(val, usr, depth - 1))
    isLiked = False
    author = User.query.filter(User.id == comment.poster).first()
    if(usr):
        isLiked = True if Like.query.filter(Like.post == comment.id).filter(Like.owner == usr).first() else False
    comm = {"id":comment.id,
            "tsince":foutput,
            "authorpic": author.picture,
            "author":author.displayName, 
            "content":comment.content,
            "likes":0 if not len(comment.likes) else len(comment.likes), 
            "isLiked": isLiked,
            "isText": True, 
            "replies":comms}
    return comm

def tstamp_to_tsince(tstamp):
    foutput = ""
    time = datetime.utcnow()
    tdelta = time-tstamp
    days, seconds = tdelta.days, tdelta.seconds
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
    return foutput


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
    user.picture = "/storage/boba.png"
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