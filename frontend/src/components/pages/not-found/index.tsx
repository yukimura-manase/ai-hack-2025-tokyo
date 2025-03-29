import { Button } from "@/components/shared/ui-elements/button";
import { Link } from "react-router-dom";

/**
 * 404 Not Foundページのコンポーネント
 */
export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
      <h2 className="mb-8 text-2xl font-semibold text-gray-600">
        ページが見つかりません
      </h2>
      <p className="mb-8 text-gray-500">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Button asChild>
        <Link to="/" className="px-6 py-3">
          ホームに戻る
        </Link>
      </Button>
    </div>
  );
};
