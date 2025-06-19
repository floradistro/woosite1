export default function TestNavPage() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Navigation Bar Test Page</h1>
      <p className="text-white mb-4">Scroll down to test if the navigation bar stays fixed at the bottom.</p>
      
      {/* Generate lots of content to enable scrolling */}
      {Array.from({ length: 50 }, (_, i) => (
        <div key={i} className="bg-[#3a3a3a] rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-white">Section {i + 1}</h2>
          <p className="text-white/80">
            This is test content to create a scrollable page. The bottom navigation bar should stay fixed at the bottom of the screen as you scroll through this content.
          </p>
        </div>
      ))}
      
      <div className="bg-green-600 text-white p-4 rounded-lg">
        <p className="font-bold">End of Content</p>
        <p>If you can see this and the navigation bar is still visible at the bottom, the fix is working!</p>
      </div>
    </div>
  );
} 