const FileCard = ({ title, type, thumbnail }) => (
  <div className="rounded-lg bg-gray-800 hover:bg-gray-700 transition overflow-hidden shadow-md">
    <img src={thumbnail} alt={title} className="w-full h-24 object-cover" />
    <div className="p-3">
      <p className="text-sm font-medium text-white truncate">{title}</p>
      <p className="text-xs text-gray-400">{type}</p>
    </div>
  </div>
);

export default FileCard;
