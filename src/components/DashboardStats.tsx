function DashboardStats() {
    return (
        <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
                <h2 className="card-title">Semesterstatistik</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Gesamte Absenzen</div>
                            <div className="stat-value">15</div>
                            <div className="stat-desc">Frühlingssemester 2025</div>
                        </div>
                    </div>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Krankheitstage</div>
                            <div className="stat-value text-error">6</div>
                            <div className="stat-desc">40% aller Absenzen</div>
                        </div>
                    </div>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Andere Absenzen</div>
                            <div className="stat-value text-info">9</div>
                            <div className="stat-desc">60% aller Absenzen</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DashboardStats;