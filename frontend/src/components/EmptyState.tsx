interface EmptyStateProps {
  onSeed: () => void
  loading: boolean
}

export function EmptyState({ onSeed, loading }: EmptyStateProps) {
  return (
    <div className="text-center mt-8">
      <p className="text-gray-400 mb-4">暂无任务，添加一个吧！</p>
      <button
        onClick={onSeed}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
      >
        添加示例任务
      </button>
    </div>
  )
}
