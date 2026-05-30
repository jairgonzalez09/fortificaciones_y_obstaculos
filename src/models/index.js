import { MultimediaFiles } from './multimedia/multimedia_files.js';
import { MultimediaInfo } from './multimedia/multimedia_info.js';

MultimediaFiles.hasOne(MultimediaInfo, {
    foreignKey: 'multimediaId',
    as: 'info'
});

MultimediaInfo.belongsTo(MultimediaFiles, {
    foreignKey: 'multimediaId',
    as: 'file'
});

export { MultimediaFiles, MultimediaInfo };