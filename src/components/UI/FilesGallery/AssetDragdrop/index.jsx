const AssetDragdrop = ({ dragStartHandler, dragLeaveHandler, onDropHandler, drag, inputFile }) => {
  return (
    <div className="asset-dragdrop">
      <div className="asset-dragdrop-zone">
        {drag ? (
          <div onDragStart={(e) => dragStartHandler(e)} onDragLeave={(e) => dragLeaveHandler(e)} onDragOver={(e) => dragStartHandler(e)} onDrop={(e) => onDropHandler(e)} className="dropdrag__zone">
            Опустите файл, чтобы загрузить его
          </div>
        ) : (
          <div
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onClick={() => inputFile.current.click()}
            className="dropdrag__zone-button"
          >
            Перетащите файл, чтобы загрузить его
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDragdrop;
