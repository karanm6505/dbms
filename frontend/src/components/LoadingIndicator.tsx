export function LoadingIndicator({ message = "Loading..." }: { message?: string }) {
  return <div className="loading-indicator">{message}</div>;
}
