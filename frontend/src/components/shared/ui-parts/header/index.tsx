/**
 * ページ共通のHeader
 */
export const Header = () => {
  return (
    // ヘッダーの背景色をグラデーションにする。
    <header className="bg-gradient-to-r from-[#27ae60] via-[#3498db] to-[#e67e22] text-white relative z-[999]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="/make-hiroin.png"
            alt="負けヒロイン"
            className="w-[50px] h-[50px]"
          />
          <h1 className="text-2xl font-bold">
            負けイン育成計画❤️❤️❤️！！！！！
          </h1>
        </div>
      </div>
    </header>
  );
};
