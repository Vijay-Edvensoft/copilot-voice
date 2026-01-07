export type Props = {
  onChange: (name: string, value: string) => void;
  options?: string[];
  value?: string | number;
  name: string;
  label: string;
};

const Select = (props: Props) => {
  const { onChange, options, name, label, value } = props;
  return (
    <div className="space-y-2 mb-4 ">
      <label
        className="text-sm font-medium text-gray-300 flex items-center space-x-2"
        htmlFor={name}
      >
        {/* <i className="text-[#3B82F6]" data-fa-i2svg=""><svg className="svg-inline--fa fa-list-ol" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list-ol" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M24 56c0-13.3 10.7-24 24-24H80c13.3 0 24 10.7 24 24V176h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H40c-13.3 0-24-10.7-24-24s10.7-24 24-24H56V80H48C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432H120c13.3 0 24 10.7 24 24s-10.7 24-24 24H32c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></svg></i> */}

        <span>{label}</span>
      </label>
      <div className="flex flex-col">
        <select
          className="border border-border-color rounded-sm p-1 "
          name={name}
          id=""
          value={value}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          required
        >
          <option className="bg-[#374151]/50" value="">
            Select Type
          </option>
          {options?.map((option) => {
            return (
              <option
                className="bg-[#374151] border rounded-md"
                key={option}
                value={option}
              >
                {option}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default Select;
