function DashboardLastAbsences() {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Letzte Absenzen</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Grund</th>
                            <th>Status</th>
                            <th>Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>15.04.2025 - 17.04.2025</td>
                            <td>Krankheit</td>
                            <td>
                                <div className="badge badge-success">Genehmigt</div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button className="btn btn-xs btn-outline btn-info">
                                        Ansehen
                                    </button>
                                    <button className="btn btn-xs btn-outline">Bearbeiten</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>03.03.2025 - 07.03.2025</td>
                            <td>Urlaub</td>
                            <td>
                                <div className="badge badge-success">Genehmigt</div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button className="btn btn-xs btn-outline btn-info">Ansehen</button>
                                    <button className="btn btn-xs btn-outline">Bearbeiten</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>22.04.2025 - 26.04.2025</td>
                            <td>Fortbildung</td>
                            <td>
                                <div className="badge badge-warning">Ausstehend</div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button className="btn btn-xs btn-outline btn-info">Ansehen</button>
                                    <button className="btn btn-xs btn-outline">Bearbeiten</button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
);
}
export default DashboardLastAbsences;