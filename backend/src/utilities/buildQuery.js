const buildQuery = (query,userId) => {
    const {
      type,
      minSize,
      maxSize,
      date,
      search,
    } = query;

    const filter = { uploadedBy: userId, isTrashed: false };


    if(type){
        filter.type = type
    }

    if(minSize || maxSize){
        filter.size = {};

        if(minSize){
            filter.size.$gte = Number(minSize)
        }
        if(maxSize){
            filter.size.$gte = Number(maxSize)
        }
    }

    if(date){
        const start =  new Date(date);
        const end = new Date(date)

        end.setDate(end.getDate()+1)

        filter.createdAt = { $gte: start,$lt : end}

    }

    if(search){
        filter.fileName - { $regex : search,$options : "i"}
    }

    return filter;


}

const buildSortStage = (sort) => {
    if(sort === "oldest") return { createdAt: -1};
    if(sort === "sizeAsc") return { size: 1};
    if(sort === "sizeDesc") return { size: -1};
    return { createdAt: 1}
}

module.exports = { buildQuery,buildSortStage}