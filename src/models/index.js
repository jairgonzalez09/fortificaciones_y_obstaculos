import { MultimediaFiles } from './multimedia/multimedia_files.js';
import { MultimediaInfo } from './multimedia/multimedia_info.js';
import { User } from './user/users.js';

MultimediaFiles.hasOne(MultimediaInfo, { 
    foreignKey: { name: 'multimediaId', field: 'multimedia_id' }, 
    as: 'info' 
});
MultimediaInfo.belongsTo(MultimediaFiles, { 
    foreignKey: { name: 'multimediaId', field: 'multimedia_id' }, 
    as: 'file' 
});

MultimediaInfo.hasMany(MultimediaInfo, { 
    foreignKey: { name: 'parentId', field: 'parent_id' },
    as: 'steps' 
});
MultimediaInfo.belongsTo(MultimediaInfo, { 
    foreignKey: { name: 'parentId', field: 'parent_id' },
    as: 'parent' 
});

export { MultimediaFiles, MultimediaInfo, User };