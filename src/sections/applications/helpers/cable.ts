export default function cable(identifier: string) {
  const wsCurrent = new WebSocket(
    `wss://${import.meta.env.VITE_APP_API_CABLE_URL}/cable?origin=app`,
    [`actioncable-v1-json`, `actioncable-unsupported`, localStorage.getItem('accesstoken')!]
  );

  wsCurrent.onopen = () => {
    // Subscribe to the channel
    wsCurrent!.send(
      JSON.stringify({
        command: 'subscribe',
        identifier,
      })
    );
  };

  return wsCurrent;
}
