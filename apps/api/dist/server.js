"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_http = __toESM(require("http"));
var import_express2 = __toESM(require("express"));
var import_server = require("@apollo/server");
var import_drainHttpServer = require("@apollo/server/plugin/drainHttpServer");
var import_express4 = require("@apollo/server/express4");

// src/schemas/index.ts
var typeDefs = `#graphql
  scalar DateTime
  type Query {
    # Auth
    refreshAccessToken(refresh_token: String!): TokenResponse!
    logoutUser: Boolean!

    # User
    getMe: UserResponse!

    # Files
    getFiles(search: String): [File]!
    getFileById(id: String!, isPublic: Boolean!): File!
    getFavorites: [File]!
  }

  type Mutation {
    # Auth
    loginUser(input: LoginInput!): TokenResponse!
    signupUser(input: SignUpInput!): Boolean
    oAuth(input: OAuthInput!): TokenResponse!
    verifyAccount(input: verifyAccountInput!): TokenResponse!

    # Files
    createFile: File!
    addNewUserAccess(input: NewUserAccessInput!): [UserAccess]
    changeUserAccess(input: ChangeUserAccessInput!): [UserAccess]
    toogleFavorite(input: ToogleFavoriteInput!): [File]
    toogleIsPublic(input: ToogleIsPublicInput!): Boolean!
    updateFile(input: UpdateFileInput!): File!
    deleteFile(input: DeleteFileInput!): Boolean
  }

  input UpdateFileInput {
    id: String!
    name: String
    thumbnail: String
    whiteboard: String
  }
  
  input DeleteFileInput {
    id: String!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    passwordConfirm: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input OAuthInput {
    strategy: String!
    code: String!
  }
  
  input NewUserAccessInput {
    id: String!
    email: String!
    role: String!
  }

  input ChangeUserAccessInput {
    id: String!
    user_id: String!
    role: String!
  }

  input verifyAccountInput {
    id: String
  }

  input ToogleFavoriteInput{
    id: String!
  }

  input ToogleIsPublicInput {
    id: String!
    value: Boolean!
  }
  
  type File {
    id: ID!
    name: String!
    isPublic: Boolean
    thumbnail: String
    whiteboard: String
    userAccess: [UserAccess!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type UserAccess {
    userId: UserAccessDetail!
    role: String!
  }

  type UserAccessDetail {
    _id: String!
    name: String!
    email: String!
    photo: String
  }

  type TokenResponse {
    access_token: String!
    refresh_token: String!
  }

  type UserResponse {
    user: UserData!
  }

  type UserData {
    id: ID!
    name: String!
    email: String!
    role: String!
    photo: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
var schemas_default = typeDefs;

// src/controllers/auth.controller.ts
var import_graphql5 = require("graphql");

// src/controllers/error.controller.ts
var import_graphql = require("graphql");
var handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  throw new import_graphql.GraphQLError(message, {
    extensions: {
      code: "GRAPHQL_VALIDATION_FAILED"
    }
  });
};
var handleValidationError = (error) => {
  const message = Object.values(error.errors).map((el) => el.message);
  throw new import_graphql.GraphQLError(`Invalid input: ${message.join(", ")}`, {
    extensions: {
      code: "GRAPHQL_VALIDATION_FAILED"
    }
  });
};
var errorHandler = (err) => {
  if (err.name === "CastError")
    handleCastError(err);
  if (err.name === "ValidationError")
    handleValidationError(err);
  throw err;
};
var error_controller_default = errorHandler;

// src/middleware/check-auth.ts
var import_graphql2 = require("graphql");
var checkAuth = (req, userAuth2) => __async(void 0, null, function* () {
  const authUser = yield userAuth2(req);
  if (!authUser) {
    throw new import_graphql2.GraphQLError("You are not logged in", {
      extensions: {
        code: "UNAUTHENTICATED"
      }
    });
  }
  return authUser;
});
var check_auth_default = checkAuth;

// src/core/redis.ts
var import_redis = require("redis");

// src/env.config.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var NODE_ENV = process.env.NODE_ENV || "development";
var PORT = process.env.PORT || "8000";
var FRONT_URI = process.env.FRONT_URI || "http://localhost:3000";
var RATE_LIMIT = process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 60;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.wxu482x.mongodb.net/?retryWrites=true&w=majority";
var JWT_ACCESS_PRIVATE_KEY = process.env.JWT_ACCESS_PRIVATE_KEY || "XcVH/KjbFhUGSB1Ojv+Nrw==";
var JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY || "1APYcPZipytM6sHWwuVjCw==";
var JWT_ACCESS_TOKEN_EXPIRED_IN = process.env.JWT_ACCESS_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRED_IN) : 120 * 24;
var JWT_REFRESH_TOKEN_EXPIRED_IN = process.env.JWT_REFRESH_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN) : 120 * 24 * 30;
var REDIS_HOST = process.env.REDIS_HOST || "<redis_host>";
var REDIS_PASSWORD = process.env.REDIS_PASSWORD || "<redis_password>";
var REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 19027;
var RESEND_API_KEY = process.env.RESEND_API_KEY || "<resend_api_key>";

// src/core/redis.ts
var redisClient = (0, import_redis.createClient)({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});
var connectRedis = () => __async(void 0, null, function* () {
  try {
    yield redisClient.connect();
  } catch (error) {
    console.error(error.message);
    setInterval(connectRedis, 5e3);
  }
});
connectRedis();
redisClient.on(
  "connect",
  () => console.log("Redis client connected successfully")
);
redisClient.on("error", (err) => console.error(err));
var redis_default = redisClient;

// src/models/user.ts
var import_mongoose = __toESM(require("mongoose"));
var import_validator = __toESM(require("validator"));
var import_bcryptjs = __toESM(require("bcryptjs"));
var userSchema = new import_mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [import_validator.default.isEmail, "Please provide a valid email"],
      lowercase: true
    },
    password: {
      type: String,
      required: false,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [false, "Please confirm your password"],
      validate: {
        validator: function(val) {
          return val === this.password;
        },
        message: "Passwords do not match"
      }
    },
    role: {
      type: String,
      default: "user"
    },
    verified: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.index({ email: 1 });
userSchema.pre("save", function(next) {
  return __async(this, null, function* () {
    var _a;
    if (!this.isModified("password"))
      return next();
    this.password = yield import_bcryptjs.default.hash((_a = this.password) != null ? _a : "", 12);
    this.passwordConfirm = void 0;
    next();
  });
});
userSchema.methods.comparePasswords = function(candidatePassword, hashedPassword) {
  return __async(this, null, function* () {
    return yield import_bcryptjs.default.compare(candidatePassword, hashedPassword);
  });
};
var userModel = import_mongoose.default.model("User", userSchema);
var user_default = userModel;

// src/services/auth.service.ts
var import_graphql3 = require("graphql");

// src/core/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var signJwt = (payload, Key, options) => {
  var _a;
  const keySecret = (_a = process.env[Key]) != null ? _a : "SECRET";
  return import_jsonwebtoken.default.sign(payload, keySecret, __spreadValues({}, options && options));
};
var verifyJwt = (token, Key) => {
  var _a;
  const keySecret = (_a = process.env[Key]) != null ? _a : "SECRET";
  const decoded = import_jsonwebtoken.default.verify(token, keySecret);
  return decoded;
};

// src/services/mail.service.ts
var import_resend = require("resend");
var resend = new import_resend.Resend(RESEND_API_KEY);
var userRegisterEmail = (name, email, link) => __async(void 0, null, function* () {
  return yield resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Welcome to Syncboard",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Verify your email address</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
      .container { width: 80%; margin: 0 auto; background: #fff; padding: 20px; }
      .header { background-color: #000000; color: #fff; padding: 10px; text-align: center; }
      .content { margin-top: 20px; }
      .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #888; }
    </style>
    </head>
    <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Syncboard!</h1>
      </div>
      <div class="content">
        <p>Hi, ${name}</p>
        <p>Thank you for register on syncboard, please verify your email by clicking link below</p>
        <a href="${link}">${link}</a>
        <p>Best regards,<br>
        Jung Rama
      </div>
      <div class="footer">
        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Syncboard. All rights reserved.
      </div>
    </div>
    </body>
    </html>`
  });
});
var mail_service_default = {
  userRegisterEmail
};

// src/services/auth.service.ts
var signTokens = (user) => __async(void 0, null, function* () {
  yield redis_default.set(user.id, JSON.stringify(user), {
    EX: 60 * 60
  });
  const access_token = signJwt({ user: user.id }, "JWT_ACCESS_PRIVATE_KEY", {
    expiresIn: `${JWT_ACCESS_TOKEN_EXPIRED_IN}m`
  });
  const refresh_token = signJwt({ user: user.id }, "JWT_REFRESH_PRIVATE_KEY", {
    expiresIn: `${JWT_REFRESH_TOKEN_EXPIRED_IN}m`
  });
  return { access_token, refresh_token };
});
var createUser = (input) => __async(void 0, null, function* () {
  let user = yield user_default.findOne({ email: input.email });
  if (user && !user.verified) {
    user = yield user_default.findOneAndUpdate(
      {
        email: input.email
      },
      {
        name: input.name,
        password: input.password
      }
    );
  } else {
    user = yield user_default.create({
      name: input.name,
      email: input.email,
      password: input.password,
      passwordConfirm: input.passwordConfirm,
      verified: false
    });
  }
  yield mail_service_default.userRegisterEmail(
    input.name,
    input.email,
    FRONT_URI + `/callback/verify?code=${user == null ? void 0 : user.id}`
  );
  user == null ? true : delete user.id;
  return user;
});
var loginUser = (input) => __async(void 0, null, function* () {
  var _a;
  const user = yield user_default.findOne({ email: input.email }).select("+password +verified");
  if (!input.password || input.password === "" || !user || !(yield user.comparePasswords(input.password, (_a = user.password) != null ? _a : ""))) {
    throw new import_graphql3.GraphQLError("Invalid email or password", {
      extensions: {
        code: "AUTHENTICATION_ERROR"
      }
    });
  }
  if (!user.verified) {
    throw new import_graphql3.GraphQLError("Please verify your email address", {
      extensions: {
        code: "AUTHENTICATION_ERROR"
      }
    });
  }
  if (user == null ? void 0 : user.password) {
    delete user.password;
  }
  const { access_token, refresh_token } = yield signTokens(user);
  return {
    access_token,
    refresh_token
  };
});
var refreshToken = (current_refresh_token) => __async(void 0, null, function* () {
  const decoded = verifyJwt(current_refresh_token, "JWT_REFRESH_PRIVATE_KEY");
  if (!decoded) {
    throw new import_graphql3.GraphQLError("Could not refresh access token", {
      extensions: {
        code: "FORBIDDEN"
      }
    });
  }
  const session = yield redis_default.get(decoded.user);
  if (!session) {
    throw new import_graphql3.GraphQLError("User session has expired", {
      extensions: {
        code: "FORBIDDEN"
      }
    });
  }
  const user = yield user_default.findById(JSON.parse(session)._id).select("+verified");
  if (!user || !user.verified) {
    throw new import_graphql3.GraphQLError("Could not refresh access token", {
      extensions: {
        code: "FORBIDDEN"
      }
    });
  }
  const { access_token, refresh_token } = yield signTokens(user);
  return {
    access_token,
    refresh_token
  };
});
var verifyAccount = (id) => __async(void 0, null, function* () {
  const user = yield user_default.findOne({
    id,
    verified: false
  });
  if (!user) {
    throw new import_graphql3.GraphQLError("User not found", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }
  user.verified = true;
  yield user.save();
  const { access_token, refresh_token } = yield auth_service_default.signTokens(user);
  return {
    access_token,
    refresh_token
  };
});
var logout = (user) => __async(void 0, null, function* () {
  if (user) {
    yield redis_default.del(user._id.toString());
  }
  return true;
});
var auth_service_default = {
  signTokens,
  createUser,
  loginUser,
  refreshToken,
  verifyAccount,
  logout
};

// src/services/oauth.service.ts
var import_axios = __toESM(require("axios"));
var import_graphql4 = require("graphql");
var getOAuthProfile = (strategy, token) => __async(void 0, null, function* () {
  let profile = null;
  if (strategy === "GITHUB") {
    profile = yield (0, import_axios.default)({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + token
      }
    });
  }
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile.data;
});
var continueWithOAuth = (strategy, code) => __async(void 0, null, function* () {
  if (strategy === "GITHUB") {
    const githubOauth = yield import_axios.default.get(
      "https://github.com/login/oauth/access_token",
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          accept: "application/json"
        }
      }
    );
    if (githubOauth.data.error) {
      throw new import_graphql4.GraphQLError("Github oauth error!", {
        extensions: {
          code: "AUTHENTICATION_ERROR"
        }
      });
    }
    const profile = yield getOAuthProfile(
      "GITHUB",
      githubOauth.data.access_token
    );
    let user = yield user_default.findOne({ email: profile.email });
    if (!user) {
      user = yield user_default.create({
        name: profile.name,
        email: profile.email,
        photo: profile.avatar_url,
        password: "",
        passwordConfirm: "",
        verified: true
      });
    }
    const { access_token, refresh_token } = yield auth_service_default.signTokens(user);
    return {
      access_token,
      refresh_token
    };
  }
});

// src/controllers/auth.controller.ts
var signup = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, { input: { name, email, password, passwordConfirm } }, { req }) {
  try {
    yield auth_service_default.createUser({
      name,
      email,
      password,
      passwordConfirm
    });
    return true;
  } catch (error) {
    if (error.code === 11e3) {
      throw new import_graphql5.GraphQLError("User Already Exist", {
        extensions: {
          code: "FORBIDDEN"
        }
      });
    }
    error_controller_default(error);
  }
});
var login = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, { input: { email, password } }, { req }) {
  try {
    const loginService = yield auth_service_default.loginUser({
      email,
      password
    });
    return {
      access_token: loginService == null ? void 0 : loginService.access_token,
      refresh_token: loginService == null ? void 0 : loginService.refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var oAuth = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, { input: { strategy, code } }, { req }) {
  try {
    const oAuthService = yield continueWithOAuth(strategy, code);
    return {
      access_token: oAuthService == null ? void 0 : oAuthService.access_token,
      refresh_token: oAuthService == null ? void 0 : oAuthService.refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var refreshAccessToken = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, { refresh_token }, { req }) {
  try {
    const refreshTokenService = yield auth_service_default.refreshToken(refresh_token);
    return {
      access_token: refreshTokenService == null ? void 0 : refreshTokenService.access_token,
      refresh_token: refreshTokenService == null ? void 0 : refreshTokenService.refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var verifyAccount2 = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, { input: { code } }, { req }) {
  try {
    const verifyAccount3 = yield auth_service_default.verifyAccount(code);
    return {
      access_token: verifyAccount3 == null ? void 0 : verifyAccount3.access_token,
      refresh_token: verifyAccount3 == null ? void 0 : verifyAccount3.refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var logout2 = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, args, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    auth_service_default.logout(user);
    return true;
  } catch (error) {
    error_controller_default(error);
  }
});
var getMe = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (root, args, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    return {
      status: "success",
      user
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var auth_controller_default = {
  signup,
  login,
  oAuth,
  verifyAccount: verifyAccount2,
  logout: logout2,
  getMe,
  refreshAccessToken
};

// src/controllers/files.controller.ts
var import_underscore = __toESM(require("underscore"));

// src/models/file.ts
var import_mongoose2 = __toESM(require("mongoose"));
var fileSchema = new import_mongoose2.Schema(
  {
    name: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    whiteboard: {
      type: String,
      required: false
    },
    userAccess: [
      {
        userId: {
          type: import_mongoose2.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        role: {
          type: String,
          required: true
        }
      }
    ],
    favoriteBy: [
      {
        userId: {
          type: import_mongoose2.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
var fileModel = import_mongoose2.default.model("File", fileSchema);
var file_default = fileModel;

// src/controllers/files.controller.ts
var import_graphql6 = require("graphql");
var import_identicon = __toESM(require("identicon.js"));
var import_crypto = __toESM(require("crypto"));
var import_fs = __toESM(require("fs"));
var get = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { search }, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    const query = {
      "userAccess.userId": user == null ? void 0 : user._id
    };
    if (search) {
      Object.assign(query, {
        name: { $regex: ".*" + search + ".*", $options: "i" }
      });
    }
    const files = yield file_default.find(query).populate({
      path: "userAccess.userId",
      model: "User",
      select: "name photo email"
    }).sort({ updatedAt: -1 });
    return files;
  } catch (error) {
    error_controller_default(error);
  }
});
var getById = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { id, isPublic }, { req, userAuth: userAuth2 }) {
  try {
    let user, query = null;
    if (!isPublic) {
      user = yield check_auth_default(req, userAuth2);
      query = {
        "userAccess.userId": user == null ? void 0 : user._id,
        _id: id
      };
    } else {
      query = {
        _id: id,
        isPublic: true
      };
    }
    const files = yield file_default.findOne(query).populate({
      path: "userAccess.userId",
      model: "User",
      select: "name photo email"
    });
    return files;
  } catch (error) {
    error_controller_default(error);
  }
});
var getFavorites = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    const query = {
      "userAccess.userId": user == null ? void 0 : user._id,
      "favoriteBy.userId": user == null ? void 0 : user._id
    };
    const files = yield file_default.find(query).sort({ updatedAt: -1 });
    return files;
  } catch (error) {
    error_controller_default(error);
  }
});
var toogleFavorite = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input }, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    const file = yield file_default.findOne({
      _id: input.id,
      "userAccess.userId": user == null ? void 0 : user._id
    });
    if (!file) {
      throw new import_graphql6.GraphQLError("File not found!", {
        extensions: {
          code: "VALIDATION"
        }
      });
    }
    const userIndex = file.favoriteBy.findIndex(
      (item) => item.userId.toString() == (user == null ? void 0 : user._id.toString())
    );
    if (userIndex > -1) {
      yield file.favoriteBy.splice(userIndex, 1);
    } else {
      yield file.favoriteBy.push({
        userId: user == null ? void 0 : user._id
      });
    }
    yield file.save();
    return yield file_default.find({
      "userAccess.userId": user == null ? void 0 : user._id,
      "favoriteBy.userId": user == null ? void 0 : user._id
    });
  } catch (error) {
    error_controller_default(error);
  }
});
var toogleIsPublic = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input }, { req, userAuth: userAuth2 }) {
  var _a;
  try {
    const user = yield check_auth_default(req, userAuth2);
    const file = yield file_default.findOneAndUpdate(
      {
        _id: input.id,
        userAccess: {
          $elemMatch: {
            userId: user._id,
            role: "OWNER"
          }
        }
      },
      {
        isPublic: input.value
      },
      {
        new: true
      }
    );
    console.log(file);
    return (_a = file == null ? void 0 : file.isPublic) != null ? _a : false;
  } catch (error) {
    error_controller_default(error);
  }
});
var addNewUserAccess = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input }, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    const selectedUser = yield user_default.findOne({
      email: input.email
    });
    if (!selectedUser) {
      throw new import_graphql6.GraphQLError("User not found!", {
        extensions: {
          code: "VALIDATION"
        }
      });
    }
    const file = yield file_default.findOneAndUpdate(
      {
        _id: input.id
      },
      {
        $push: {
          userAccess: {
            userId: selectedUser == null ? void 0 : selectedUser._id,
            role: input.role
          }
        }
      },
      {
        new: true
      }
    ).populate({
      path: "userAccess.userId",
      model: "User",
      select: "name photo email"
    });
    return file == null ? void 0 : file.userAccess;
  } catch (error) {
    error_controller_default(error);
  }
});
var changeUserAccess = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input }, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    let file = null;
    if (input.role === "REMOVE") {
      file = yield file_default.findOneAndUpdate(
        {
          _id: input.id
        },
        {
          $pull: {
            userAccess: { userId: input.user_id }
          }
        },
        {
          new: true
        }
      );
      console.log(input.role, input.user_id);
    } else {
      file = yield file_default.findOneAndUpdate(
        {
          _id: input.id,
          "userAccess.userId": input.user_id
        },
        {
          $set: {
            "userAccess.$.role": input.role
          }
        },
        {
          new: true
        }
      );
    }
    yield file == null ? void 0 : file.populate({
      path: "userAccess.userId",
      model: "User",
      select: "name photo email"
    });
    return file == null ? void 0 : file.userAccess;
  } catch (error) {
    error_controller_default(error);
  }
});
var create = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, userAuth: userAuth2 }) {
  try {
    const user = yield check_auth_default(req, userAuth2);
    const countFile = yield file_default.countDocuments({
      userAccess: {
        $elemMatch: {
          userId: user._id,
          role: "OWNER"
        }
      }
    });
    if (countFile >= 3) {
      throw new import_graphql6.GraphQLError("For demo purpose you can only have 3 files!", {
        extensions: {
          code: "VALIDATION"
        }
      });
    }
    const thumbName = import_crypto.default.randomUUID();
    const thumbnail = new import_identicon.default(thumbName, 420);
    const dir = "public/storage/";
    if (!import_fs.default.existsSync(dir)) {
      import_fs.default.mkdirSync(dir);
    }
    import_fs.default.writeFile(
      dir + thumbName + ".png",
      thumbnail.toString(),
      "base64",
      function(err) {
        console.log(err);
      }
    );
    const file = yield file_default.create({
      name: "Untitled File",
      thumbnail: thumbName + ".png",
      whiteboard: null,
      updatedAt: /* @__PURE__ */ new Date(),
      userAccess: [
        {
          userId: user == null ? void 0 : user._id,
          role: "OWNER"
        }
      ]
    });
    return file;
  } catch (error) {
    error_controller_default(error);
  }
});
var update = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, userAuth: userAuth2 }) {
  try {
    yield check_auth_default(req, userAuth2);
    const getInput = import_underscore.default.omit(args.input, import_underscore.default.isNull);
    const file = yield file_default.findByIdAndUpdate(
      args.input.id,
      __spreadValues({}, getInput),
      {
        new: true
      }
    );
    return file;
  } catch (error) {
    error_controller_default(error);
  }
});
var del = () => {
};
var files_controller_default = {
  get,
  getById,
  addNewUserAccess,
  changeUserAccess,
  getFavorites,
  toogleFavorite,
  toogleIsPublic,
  create,
  update,
  del
};

// src/resolvers/mutation.resolver.ts
var mutation_resolver_default = {
  // Auth User
  signupUser: auth_controller_default.signup,
  loginUser: auth_controller_default.login,
  oAuth: auth_controller_default.oAuth,
  verifyAccount: auth_controller_default.verifyAccount,
  // Files
  createFile: files_controller_default.create,
  updateFile: files_controller_default.update,
  toogleFavorite: files_controller_default.toogleFavorite,
  toogleIsPublic: files_controller_default.toogleIsPublic,
  addNewUserAccess: files_controller_default.addNewUserAccess,
  changeUserAccess: files_controller_default.changeUserAccess
};

// src/resolvers/query.resolver.ts
var query_resolver_default = {
  // Auth Users
  getMe: auth_controller_default.getMe,
  refreshAccessToken: auth_controller_default.refreshAccessToken,
  logoutUser: auth_controller_default.logout,
  // Files
  getFiles: files_controller_default.get,
  getFavorites: files_controller_default.getFavorites,
  getFileById: files_controller_default.getById
};

// src/server.ts
var import_cors = __toESM(require("cors"));

// src/core/mongoose.ts
var import_mongoose3 = __toESM(require("mongoose"));
function connectDB() {
  return __async(this, null, function* () {
    try {
      yield import_mongoose3.default.connect(MONGODB_URI);
      const db = import_mongoose3.default.connection;
      db.on("error", console.error.bind(console, "connection error:"));
      console.log("Database connected successfully");
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  });
}
var mongoose_default = connectDB;

// src/app.ts
var import_express = __toESM(require("express"));
var import_dotenv2 = __toESM(require("dotenv"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_express_rate_limit = require("express-rate-limit");
var app = (0, import_express.default)();
import_dotenv2.default.config();
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((0, import_cookie_parser.default)());
app.use(import_express.default.static("public"));
app.use(
  (0, import_express_rate_limit.rateLimit)({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    limit: RATE_LIMIT,
    standardHeaders: "draft-7",
    legacyHeaders: false
    // Disable the `X-RateLimit-*` headers.
  })
);
app.get("/", (req, res) => {
  res.send('Welcome to "Collaborative Whiteboard"!');
});
app.use(import_express.default.static("public"));
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION \u{1F525} Shutting down...");
  console.error("Error\u{1F525}", err.message);
  process.exit(1);
});
var app_default = app;

// src/middleware/user-auth.ts
var import_graphql7 = require("graphql");
var userAuth = (req) => __async(void 0, null, function* () {
  try {
    let access_token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      const { access_token: token } = req.cookies;
      access_token = token;
    }
    if (!access_token)
      return false;
    const decoded = verifyJwt(access_token, "JWT_ACCESS_PRIVATE_KEY");
    if (!decoded)
      return false;
    const session = yield redis_default.get(decoded.user);
    if (!session) {
      throw new import_graphql7.GraphQLError("Session has expired", {
        extensions: {
          code: "FORBIDDEN"
        }
      });
    }
    const user = yield user_default.findById(JSON.parse(session).id).select("+verified");
    if (!user || !user.verified) {
      throw new import_graphql7.GraphQLError(
        "The user belonging to this token no longer exists",
        {
          extensions: {
            code: "FORBIDDEN"
          }
        }
      );
    }
    return user;
  } catch (error) {
    return false;
  }
});
var user_auth_default = userAuth;

// src/server.ts
var httpServer = import_http.default.createServer(app_default);
var corsOptions = {
  origin: [
    "https://studio.apollographql.com",
    `http://localhost:${PORT}`,
    FRONT_URI
  ],
  credentials: true
};
app_default.use((0, import_cors.default)(corsOptions));
var resolvers = {
  Query: query_resolver_default,
  Mutation: mutation_resolver_default
};
(function() {
  return __async(this, null, function* () {
    const server = new import_server.ApolloServer({
      typeDefs: schemas_default,
      resolvers,
      plugins: [(0, import_drainHttpServer.ApolloServerPluginDrainHttpServer)({ httpServer })]
    });
    yield mongoose_default();
    yield server.start();
    app_default.use(
      "/graphql",
      (0, import_cors.default)(),
      import_express2.default.json(),
      (0, import_express4.expressMiddleware)(server, {
        context: (_0) => __async(this, [_0], function* ({
          req,
          res
        }) {
          return { req, res, userAuth: user_auth_default };
        })
      })
    );
    yield new Promise(
      (resolve) => httpServer.listen({ port: PORT }, resolve)
    );
    console.log(`\u{1F680} Server ready at http://localhost:${PORT}/graphql`);
  });
})();
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION \u{1F525}\u{1F525} Shutting down...");
  console.error("Error\u{1F525}", err.message);
  httpServer.close(() => __async(exports, null, function* () {
    process.exit(1);
  }));
});
