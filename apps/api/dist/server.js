"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
  }

  type Mutation {
    # Auth
    loginUser(input: LoginInput!): TokenResponse!
    signupUser(input: SignUpInput!): UserResponse!
    oAuth(input: OAuthInput!): TokenResponse!

    # Files
    createFile: File!
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
  
  type File {
    id: ID!
    name: String!
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
    photo: String
  }

  type TokenResponse {
    status: String!
    access_token: String!
    refresh_token: String!
  }

  type UserResponse {
    status: String!
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
var import_graphql3 = require("graphql");

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

// src/core/redis.ts
var import_redis = require("redis");

// src/env.config.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var NODE_ENV = process.env.NODE_ENV || "development";
var PORT = process.env.PORT || 8e3;
var RATE_LIMIT = process.env.RATE_LIMIT || 60;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.wxu482x.mongodb.net/?retryWrites=true&w=majority";
var JWT_ACCESS_PRIVATE_KEY = process.env.JWT_ACCESS_PRIVATE_KEY || "XcVH/KjbFhUGSB1Ojv+Nrw==";
var JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY || "1APYcPZipytM6sHWwuVjCw==";
var JWT_ACCESS_TOKEN_EXPIRED_IN = process.env.JWT_ACCESS_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRED_IN) : 120;
var JWT_REFRESH_TOKEN_EXPIRED_IN = process.env.JWT_REFRESH_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN) : 120;
var REDIS_HOST = process.env.REDIS_HOST || "<redis_host>";
var REDIS_PASSWORD = process.env.REDIS_PASSWORD || "<redis_password>";
var REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 19027;

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

// src/controllers/auth.controller.ts
var import_axios = __toESM(require("axios"));

// src/core/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var signJwt = (payload, Key, options) => {
  var _a;
  const keySecret = (_a = process.env[Key]) != null ? _a : "SECRET";
  return import_jsonwebtoken.default.sign(payload, keySecret, __spreadValues({}, options && options));
};
var verifyJwt = (token, Key) => {
  var _a;
  try {
    const keySecret = (_a = process.env[Key]) != null ? _a : "SECRET";
    const decoded = import_jsonwebtoken.default.verify(token, keySecret);
    return decoded;
  } catch (error) {
    error_controller_default(error);
  }
};

// src/middleware/check-auth.ts
var import_graphql2 = require("graphql");
var checkAuth = (req, userAuth2) => __async(void 0, null, function* () {
  try {
    const authUser = yield userAuth2(req);
    if (!authUser) {
      throw new import_graphql2.GraphQLError("You are not logged in", {
        extensions: {
          code: "AUTHENTICATION_ERROR"
        }
      });
    }
  } catch (error) {
    error_controller_default(error);
  }
});
var check_auth_default = checkAuth;

// src/controllers/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  sameSite: false,
  secure: true
};
var accessTokenCookieOptions = __spreadProps(__spreadValues({}, cookieOptions), {
  maxAge: JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1e3,
  expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1e3)
});
var refreshTokenCookieOptions = __spreadProps(__spreadValues({}, cookieOptions), {
  maxAge: JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1e3,
  expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1e3)
});
if (process.env.NODE_ENV === "production")
  cookieOptions.secure = true;
var signup = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input: { name, email, password, passwordConfirm } }, { req }) {
  try {
    const user = yield user_default.create({
      name,
      email,
      password,
      passwordConfirm
    });
    return {
      status: "success",
      user
    };
  } catch (error) {
    if (error.code === 11e3) {
      throw new import_graphql3.GraphQLError("User Already Exist", {
        extensions: {
          code: "FORBIDDEN"
        }
      });
    }
    error_controller_default(error);
  }
});
function signTokens(user) {
  return __async(this, null, function* () {
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
}
var login = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input: { email, password } }, { req, res }) {
  var _a;
  try {
    const user = yield user_default.findOne({ email }).select("+password +verified");
    if (!user || !(yield user.comparePasswords(password, (_a = user.password) != null ? _a : ""))) {
      throw new import_graphql3.GraphQLError("Invalid email or password", {
        extensions: {
          code: "AUTHENTICATION_ERROR"
        }
      });
    }
    if (user == null ? void 0 : user.password) {
      delete user.password;
    }
    const { access_token, refresh_token } = yield signTokens(user);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, __spreadProps(__spreadValues({}, accessTokenCookieOptions), {
      httpOnly: false
    }));
    return {
      status: "success",
      access_token,
      refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var getOAuthProfile = (strategy, token) => __async(void 0, null, function* () {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
});
var oAuth = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { input: { strategy, code } }, { req, res }) {
  try {
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
        throw new import_graphql3.GraphQLError("Github oauth error!", {
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
      const { access_token, refresh_token } = yield signTokens(user);
      res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
      res.cookie("access_token", access_token, accessTokenCookieOptions);
      res.cookie("logged_in", true, __spreadProps(__spreadValues({}, accessTokenCookieOptions), {
        httpOnly: false
      }));
      return {
        status: "success",
        access_token,
        refresh_token
      };
    }
  } catch (error) {
    error_controller_default(error);
  }
});
var refreshAccessToken = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, res }) {
  try {
    const { refresh_token: current_refresh_token } = args;
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
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, __spreadProps(__spreadValues({}, accessTokenCookieOptions), {
      httpOnly: false
    }));
    return {
      status: "success",
      access_token,
      refresh_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var logout = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, res, userAuth: userAuth2 }) {
  try {
    yield check_auth_default(req, userAuth2);
    const user = yield userAuth2(req);
    if (user) {
      yield redis_default.del(user._id.toString());
    }
    res.cookie("access_token", "", { maxAge: -1 });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });
    return true;
  } catch (error) {
    error_controller_default(error);
  }
});
var getMe = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, userAuth: userAuth2 }) {
  try {
    yield check_auth_default(req, userAuth2);
    const user = yield userAuth2(req);
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
  logout,
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
    ]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
var fileModel = import_mongoose2.default.model("File", fileSchema);
var file_default = fileModel;

// src/controllers/files.controller.ts
var get = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, { search }, { req, userAuth: userAuth2 }) {
  try {
    const user = yield userAuth2(req);
    if (!user)
      throw new Error("User not found");
    const query = {
      "userAccess.userId": user == null ? void 0 : user._id
    };
    if (search) {
      Object.assign(query, {
        name: { $regex: ".*" + search + ".*" }
      });
    }
    const files = yield file_default.find(query).populate({
      path: "userAccess.userId",
      model: "User",
      select: "name photo"
      // populate: {
      // 	path: 'components',
      // 	model: 'Component'
      // }
      // Get friends of friends - populate the 'friends' array for every friend
      // populate: { path: 'friends' }
    });
    console.log(JSON.stringify(files, null, 2));
    return files;
  } catch (error) {
    error_controller_default(error);
  }
});
var create = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* (parent, args, { req, userAuth: userAuth2 }) {
  try {
    yield check_auth_default(req, userAuth2);
    const user = yield userAuth2(req);
    if (!user)
      throw new Error("User not found");
    const file = yield file_default.create({
      name: "Untitled File",
      thumbnail: null,
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
    const user = yield userAuth2(req);
    if (!user)
      throw new Error("User not found");
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
  create,
  update,
  del
};

// src/resolvers/mutation.resolver.ts
var mutation_resolver_default = {
  signupUser: auth_controller_default.signup,
  loginUser: auth_controller_default.login,
  oAuth: auth_controller_default.oAuth,
  createFile: files_controller_default.create,
  updateFile: files_controller_default.update
};

// src/resolvers/query.resolver.ts
var query_resolver_default = {
  // Users
  getMe: auth_controller_default.getMe,
  // Auth
  refreshAccessToken: auth_controller_default.refreshAccessToken,
  logoutUser: auth_controller_default.logout,
  // Files
  getFiles: files_controller_default.get
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
var app = (0, import_express.default)();
import_dotenv2.default.config();
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((0, import_cookie_parser.default)());
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION \u{1F525} Shutting down...");
  console.error("Error\u{1F525}", err.message);
  process.exit(1);
});
var app_default = app;

// src/middleware/user-auth.ts
var import_graphql4 = require("graphql");
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
      throw new import_graphql4.GraphQLError("Session has expired", {
        extensions: {
          code: "FORBIDDEN"
        }
      });
    }
    const user = yield user_default.findById(JSON.parse(session).id).select("+verified");
    if (!user || !user.verified) {
      throw new import_graphql4.GraphQLError(
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
    error_controller_default(error);
  }
});
var user_auth_default = userAuth;

// src/server.ts
var httpServer = import_http.default.createServer(app_default);
var corsOptions = {
  origin: [
    "https://studio.apollographql.com",
    `http://localhost:${PORT}`,
    `http://localhost:3000`
  ],
  credentials: true
};
app_default.use((0, import_cors.default)(corsOptions));
app_default.use(import_express2.default.json());
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
    app_default.get("/", (req, res) => {
      res.send('Welcome to "Collaborative Whiteboard"!');
    });
    app_default.get(
      "/github/callback",
      (req, res) => auth_controller_default.oAuth({
        req,
        res
      })
    );
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
