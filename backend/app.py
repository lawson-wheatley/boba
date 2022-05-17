from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from models import db
from flask import Flask, request, jsonify, make_response, g
from datetime import datetime, timedelta, timezone
from flask_migrate import Migrate
from flask_restful import Resource, wraps
import hashlib, os, uuid, json

api = Flask(__name__)
db.init_app(api)
migrate = Migrate(api, db)
api.config["JWT_SECRET_KEY"] = "12345678"
api.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
from models import User, Followers, Following, Comments, Comment, Likes, Like, Post

jwt = JWTManager(api)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'webp'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/v1/files/upload")
@jwt_required()
def upload():
   if request.method == "POST":
        if 'file' not in request.files:
           return jsonify({"message" : "No file in request"}), 400
        f = request.files['file']
        if f.filename == '':
           return jsonify({"message" : "No file selected for uploading"}), 400
        elif f and allowed_file(f.filename):
            val = os.path.splitext(f.name)
            full_final_name = str(uuid.uuid4()) + val[1]
            f.save(F"/storage/{full_final_name}")
            return jsonify({"message" : "FIle successfully uploaded", "path" : full_final_name})
        return jsonify({"mesage": "Unknown Error"}), 400
            
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
    
@api.route('/v1/auth/login')
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    return create_token(email, password)

def create_token(email, password):
    user = User.query.filter_by(email=email).first()
    if checkPass(password, user.salt) != user.key:
        return {"msg":"incorrect email or password"}, 401
    access_token = create_access_token(identity = email)
    response = {"access_token":access_token}
    return response

@api.route("/v1/auth/logout", methods=["POST"])
def logout():
    response = jsonify({"msg":"Logout successful"})
    unset_jwt_cookies(response)
    return response

@api.route("/v1/auth/register")
def register():
    dob = request.json.get("dob", None)
    username = request.json.get("username", None)
    email = request.json.get("email", None).lower()
    password = request.json.get("password", None)
    displayName = request.json.get("displayname", None)
    
    user = user = User.query.filter(User.email == email).first()
    if user:
        return jsonify({"message":"Email already in use"}), 400
    
    user = User()
    user.email = email
    passthesalt = hashPass(password=password)
    user.password = passthesalt[1]
    user.salt = passthesalt[0]
    user.last_login = datetime.now()
    user.joined = datetime.now()
    db.session.add(user)
    db.session.commit()
    response = make_response()
    response.set_cookie(
            "user",
            jwt.encode(
                User.dump(user), api.config["SECRET_KEY"], algorithm="HS256"
            ),
        )
    
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
    key = hashlib.pbkdf2_hmac('sha', password.encode('utf-8'), salt, 1000, dklen=128)
    return (salt, key)
    
def checkPass(password : str, salt: str) -> str:
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 1000, dklen=128)
