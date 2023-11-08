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
    refreshAccessToken: TokenResponse!
    logoutUser: Boolean!

    # User
    getMe: UserResponse!
  }

  type Mutation {
    # Auth
    loginUser(input: LoginInput!): TokenResponse!
    signupUser(input: SignUpInput!): UserResponse!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    passwordConfirm: String!
    photo: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type TokenResponse {
    status: String!
    access_token: String!
  }

  type UserResponse {
    status: String!
    user: UserData!
  }

  type UserData {
    id: ID!
    name: String!
    email: String!
    photo: String!
    role: String!
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
var schemas_default = typeDefs;

// src/controllers/auth.controller.ts
var import_graphql2 = require("graphql");

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
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [import_validator.default.isEmail, "Please provide a valid email"],
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be more than 8 characters"],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
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
var JWT_ACCESS_PUBLIC_KEY = process.env.JWT_ACCESS_PUBLIC_KEY || "WcZqBSFyXzSaacN6fzARVg==";
var JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY || "S60apQby8sdfaTo5LsWfrw==";
var JWT_REFRESH_PUBLIC_KEY = process.env.JWT_REFRESH_PUBLIC_KEY || "1APYcPZipytM6sHWwuVjCw==";
var JWT_ACCESS_TOKEN_EXPIRED_IN = process.env.JWT_ACCESS_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRED_IN) : 15;
var JWT_REFRESH_TOKEN_EXPIRED_IN = process.env.JWT_REFRESH_TOKEN_EXPIRED_IN ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN) : 10;
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

// src/core/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var signJwt = (payload, Key, options) => {
  var _a;
  const keySecret = (_a = process.env[Key]) != null ? _a : "SECRET";
  const privateKey = Buffer.from(keySecret, "base64").toString("ascii");
  return import_jsonwebtoken.default.sign(payload, privateKey, __spreadProps(__spreadValues({}, options && options), {
    algorithm: "RS256"
  }));
};

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
    console.log(JSON.stringify(error));
    if (error.code === 11e3) {
      throw new import_graphql2.GraphQLError("User Already Exist", {
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
      throw new import_graphql2.GraphQLError("Invalid email or password", {
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
      access_token
    };
  } catch (error) {
    error_controller_default(error);
  }
});
var auth_controller_default = {
  signup,
  login
  // refreshAccessToken,
  // logoutHandler,
};

// src/resolvers/mutation.resolver.ts
var mutation_resolver_default = {
  signupUser: auth_controller_default.signup,
  loginUser: auth_controller_default.login
};

// src/resolvers/query.resolver.ts
var query_resolver_default = {
  // Users
  getMe: () => {
    return "test";
  }
  // Auth
  // refreshAccessToken: authController.refreshAccessToken,
  // logoutUser: authController.logoutHandler,
};

// src/server.ts
var import_cors = __toESM(require("cors"));

// src/core/mongoose.ts
var import_mongoose2 = __toESM(require("mongoose"));
function connectDB() {
  return __async(this, null, function* () {
    try {
      yield import_mongoose2.default.connect(MONGODB_URI);
      const db = import_mongoose2.default.connection;
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
var import_helmet = __toESM(require("helmet"));
var import_morgan = __toESM(require("morgan"));

// src/core/winston.ts
var import_winston = __toESM(require("winston"));
var logger = import_winston.default.createLogger({
  format: import_winston.default.format.simple(),
  transports: [
    new import_winston.default.transports.File({
      level: "info",
      filename: "app.log",
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5
    }),
    new import_winston.default.transports.Console({
      level: "debug",
      handleExceptions: true
    })
  ],
  exitOnError: false
});
var winston_default = logger;

// src/app.ts
var app = (0, import_express.default)();
import_dotenv2.default.config();
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((0, import_helmet.default)());
app.use((0, import_cookie_parser.default)());
app.use((0, import_morgan.default)("combined", { stream: winston_default }));
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION \u{1F525} Shutting down...");
  console.error("Error\u{1F525}", err.message);
  process.exit(1);
});
var app_default = app;

// src/server.ts
var httpServer = import_http.default.createServer(app_default);
var corsOptions = {
  origin: [
    "https://studio.apollographql.com",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:4000"
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
      req.cookies("asd");
      res.send("Hello World!");
      res.cookie("test", "asd");
    });
    app_default.use(
      "/graphql",
      (0, import_cors.default)(),
      import_express2.default.json(),
      (0, import_express4.expressMiddleware)(server, {
        context: (_0) => __async(this, [_0], function* ({
          req,
          res
        }) {
          return { req, res };
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
