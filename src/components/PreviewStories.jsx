import { useEffect, useState } from "react";


function PreviewStories(){
    const [stories, setstories] = useState([])
    const [loading, setloading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(-1)
    useEffect(()=>{
        async function fetchStories(){
            try {
                const res = await fetch('../public/stories.json')
                if(!res.ok) throw new Error('Failed to fetch stories')
                const data = await res.json()
                setstories(data)
            } catch (error) {
                console.log(error);
                
            }finally{
                setloading(false)
            }
        }
        fetchStories()
    }, [])

    useEffect(() =>{
        if((activeIndex === -1)) return;

        const timer = setTimeout(() => {
            setActiveIndex((prev) => (prev < stories.length - 1 ? prev + 1 : -1))
        }, 5000)

        return () => clearTimeout(timer)
    } , [activeIndex , stories.length] )

     return (
        <div className="preview-stories">
        <h1>Stories</h1>

        {loading && <p>Loading...</p>}

        <div className="thumbnails-container">
            {stories.map((story, index) => (
            <div key={story.id} className="thumbnail" onClick={() => setActiveIndex(index)}>
                <img src={story.image} alt={`story-${story.id}`} />
            </div>
            ))}
        </div>

        {activeIndex !== -1 && (
            <div className="viewer-overlay" onClick={() => setActiveIndex(-1)}>
            <div
                className="viewer-content"
                onClick={(e) => e.stopPropagation()} // prevent closing on inner click
            >
                <img
                src={stories[activeIndex].image}
                alt={stories[activeIndex].username}
                className="viewer-image"
                />
                <p className="viewer-username">{stories[activeIndex].username}</p>
                <button
                    className="close-btn"
                    onClick={(e) => {
                    e.stopPropagation(); // prevent tap-right click
                    setActiveIndex(-1);
                    }}
                    style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}
                >
                    ✕
                </button>

            {/* Invisible left/right tap areas */}
                <div
                    className="tap-left"
                    onClick={() =>
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                    style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    cursor: "pointer",
                    }}
                />
                <div
                    className="tap-right"
                    onClick={() =>
                    setActiveIndex((prev) =>
                        prev < stories.length - 1 ? prev + 1 : prev
                    )
                    }
                    style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    cursor: "pointer",
                    }}
                />
            </div>
            </div>
        )}

        </div>

        
  );
}

export default PreviewStories;