const StatsCard = ({ title, value }) => (
    <div
        style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            margin: '10px',
            minWidth: '150px',
        }}
    >
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);

export default StatsCard;
