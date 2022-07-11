import Option from "../Option";

const Group = ({ onClick, defaultValue, group }) => {
  return (
    <div className="menu__list--group">
      <div className="menu__list--group-title">{group.label}</div>
      <div>
        {group.options.map((v) => (
          <Option key={v.value} onClick={onClick} defaultValue={defaultValue} option={v} />
        ))}
      </div>
    </div>
  );
};

export default Group;
