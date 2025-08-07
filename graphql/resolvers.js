import graphQLAuthUser from "../models/user.model.js";

const resolvers = {
    Query: {
        async allProfiles(_, __, context) {
            const records = await graphQLAuthUser.find({});
            return records;
        },

        async profile(_, {id}) {
            const record = graphQLAuthUser.findOne({_id: id});
            return record;
        }
    }
}

export default resolvers;