import Server from 'socket.io';

export function startServer(store) {
	const io = new Server().attach(8090);

	// FUTURE OPTIMIZATION: Instead of sending the whole state change to only sending the
	//                      relevant subset, sending diffs instead of snapshots.
	store.subscribe(
		() => io.emit('state', store.getState().toJS())
	);

	// FUTURE OPTIMIZATION: Obviously in the real world some sort of security model would
	//                      be needed here because as it is any connected Socket.io client 
	//                      can dispatch any action into the Redux store.
	io.on('connection', (socket) => {
		socket.emit('state', store.getState().toJS());
		socket.on('action', store.dispatch.bind(store));
	});
}