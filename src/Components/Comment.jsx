import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sendImg from "../assets/send.svg";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Comment = (props) => {
  const [confession, setConfession] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([])
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_URL;

  useEffect(() => {
    async function fetchConfession() {
      try {
        const res = await fetch(`${API_URL}/confessions/${props.id}`);
        const data = await res.json();
        setConfession(data.text);
        setComments(data.comments)
      } catch (error) {
        console.error("Error fetching confession:", error);
      }
    }
    fetchConfession();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  };

  const handleInputChange = (event) => {
    
    if(event.target.value.length<=300){
        setComment(event.target.value);
    }
};


  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the CAPTCHA");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/confessions/${props.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          hCaptchaToken: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      alert("Comment added successfully!");
      setComment(""); 
      setCaptchaToken(null); 
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full fixed bg-slate-950 bg-opacity-50 flex items-center justify-center z-40"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-gray-800 rounded-lg p-1 py-4 w-[95%] sm:w-[90%] max-w-md relative shadow-lg"
        >
          <button
            onClick={props.onCloseComment}
            className="absolute top-2 right-2 text-white rounded-full p-1"
          >
            ✕
          </button>

          <div id="header" className="mb-4">
            <h1 className="text-2xl sm:text-3xl text-center text-white font-semibold">
              Comments
            </h1>
          </div>

          <div id="body" className="flex flex-col space-y-4">
            <div id="confession" className="text-center rounded-sm bg- p-3">
              <h2 className="text-xl sm:text-xl text-gray-300">{confession}</h2>
            </div>

            <div id="comments" className="p-3 overflow-y-auto max-h-40 sm:max-h-60">
              {comments.map((comment, index) => (
                <p key={index} className="text-gray-300 text-lg py-1">→ {comment}</p>
              ))}
              
            </div>

            <div id="captcha" className="flex justify-center mb-3">
              <HCaptcha
                sitekey="f51c9268-17ec-4426-82c2-845648d2b2b0"
                onVerify={handleCaptchaVerify}
              />
            </div>

            <div id="input" className="flex px-2 items-center">
              <input
                type="text"
                placeholder="Write a comment...(max. 300 characters)"
                value={comment}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
                disabled={isSubmitting}
              />
              <button
                onClick={handleCommentSubmit}
                className="ml-2 bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-600"
                disabled={isSubmitting}
              >
                <img src={sendImg} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Comment;
