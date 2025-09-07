const Header = () => (
    <header className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary bg-gray-600">
                Rent Hub Dashboard
            </h1>
        </div>
        <div className="flex-none gap-2">
            {/* এখানে notification / profile future এ আসতে পারে */}
            <button className="btn btn-ghost">🔔</button>
            <div className="avatar">
                <div className="w-10 rounded-full">
                    <img src="https://i.pravatar.cc/100" alt="User Avatar" />
                </div>
            </div>
        </div>
    </header>
);

export default Header;
