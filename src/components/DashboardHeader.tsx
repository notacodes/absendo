function DashboardHeader() {
  return (
      <div className="p-6">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Absendo Dashboard</h1>
              <button className="btn btn-primary btn-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" className="w-6 h-6 mr-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  Neue Absenz
              </button>
          </div>
      </div>
  );
}
export default DashboardHeader;