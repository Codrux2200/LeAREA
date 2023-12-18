const { verifyJwt } = require("../utils/jwt.utils");

const getUser = async (request, reply) => {
    const user = await User.findById(request.userId);

    request.user = user;
    next();
};

const auth = (request, reply, next) => {
    if (request.headers && request.headers.authorization) {
        const token = request.headers.authorization.split(" ")[1];

        if (!token) {
            reply.code(401).send({ error: "Unauthorized" });
        }

        try {
            const decoded = verifyJwt(token);

            request.userId = decoded.userId;

            next();
        } catch (err) {
            reply.code(401).send({ error: "Unauthorized" });
        }
    } else {
        reply.code(401).send({ error: "Unauthorized" });
    }
};

module.exports = {
    auth,
    getUser,
};
