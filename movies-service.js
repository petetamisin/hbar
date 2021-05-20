export const createService = ({model}) => {
    return {
        getOneBySlug(slug) {
            return model.findOne({
                slug,
                isDeleted: {$ne: true}
            }).select({
                isDeleted: 0
            });
        },
        getOneByTitle(title) {
            return model.findOne({
                title,
                isDeleted: {$ne: true}
            }).select({
                isDeleted: 0
            });
        },
        listAll() {
            return model.find({
                isDeleted: {$ne: true}
            }).select({
                isDeleted: 0
            });
        },
        async create(movie) {
            return new model(movie).save();
        },
        async delete(slug) {
            await model.findOneAndUpdate({
                slug
            }, {
                $set: {
                    isDeleted: true
                }
            });
        }
    };
};
