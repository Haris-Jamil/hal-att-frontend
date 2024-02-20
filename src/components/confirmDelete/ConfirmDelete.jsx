import "./ConfirmDelete.scss";

const ConfirmDelete = ({ options, close }) => {
  return (
    <div className='confirmDelete'>
      <h2>Confirm Action</h2>
      <h3>{options.question}</h3>
      <div className='button-container'>
        <button
          onClick={() => options.deleteFunc(options.deleteId)}
          className='green'
        >
          Yes
        </button>
        <button onClick={close} className='red'>
          Cancel
        </button>
      </div>
    </div>
  );
};
export default ConfirmDelete;
