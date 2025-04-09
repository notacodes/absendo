

function ListGroup(){
    return (
        <>
        <div className="list-group">
            <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                Cras justo odio
            </a>
            <a href="#" className="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
            <a href="#" className="list-group-item list-group-item-action">Morbi leo risus</a>
            <a href="#" className="list-group-item list-group-item-action disabled" tabIndex={-1} aria-disabled="true">
                Porta ac consectetur ac
            </a>
        </div>
        </>
    );
}
export default ListGroup;