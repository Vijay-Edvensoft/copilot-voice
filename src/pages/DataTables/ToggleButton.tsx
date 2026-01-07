const ToggleButton = () => {
  return (
    <div className="flex justify-between">
      <label htmlFor="">Language/tone</label>
      <input
        type="checkbox"
        defaultChecked
        className="toggle text-amber-50 border-none bg-primary"
      />
    </div>
  );
};

export default ToggleButton;
