const Button = ({ children, onClick }) => (
    <button
        style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
        }}
        onClick={onClick}
    >
        {children}
    </button>
);

export default Button;
