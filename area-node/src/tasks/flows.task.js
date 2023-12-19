const Flow = require("../models/flow.model.js");
const User = require("../models/user.model.js");
const actionsConfig = require("../config/actions.config.js");
const triggersConfig = require("../config/triggers.config.js");

const flowTask = async () => {
    Flow.find({}).then((flows) => {
        flows.forEach((flow) => {
            const [service, action] = flow.trigger.id.split(".");

            console.log(service, action);
            User.findById(flow.user).then(async (user) => {
                const isReady = await triggersConfig[service].triggers[
                    action
                ].function(user, flow.trigger.params);

                if (isReady) {
                    const [service, action] = flow.action.id.split(".");

                    actionsConfig[service][action].function(
                        user,
                        flow.action.params
                    );
                }
            });
        });
    });
};

module.exports = {
    flowTask,
};
