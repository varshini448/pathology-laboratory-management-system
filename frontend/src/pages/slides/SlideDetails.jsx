import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import SlideViewer from "../../components/digitalPathology/SlideViewer";
import SlideViewerToolbar from "../../components/digitalPathology/SlideViewerToolbar";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SlideDetails = () => {
  const { id } = useParams();
  const viewerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSlide = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/slides/${id}`);

        if (active) {
          setSlide(response.slide || null);
          setZoom(100);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load slide details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSlide();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    let objectUrl;

    setImageUrl("");

    if (!slide?.image?.filename) {
      return () => {
        active = false;
      };
    }

    const loadImage = async () => {
      try {
        const blob = await api.getBlob(`/slides/${id}/image`);

        if (!active) return;

        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load the slide image.");
        }
      }
    };

    loadImage();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, slide?.image?.filename]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((current) => Math.min(400, current + 25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((current) => Math.max(25, current - 25));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(100);
  }, []);

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setError("Fullscreen is unavailable in this browser.");
    }
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    setUploadMessage("");

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError("Choose an image before uploading.");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("The image must be 10 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const response = await api.upload(`/slides/${id}/image`, formData);

      if (response.slide) {
        setSlide(response.slide);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setUploadMessage("Slide image uploaded successfully.");
    } catch (err) {
      setError(err.message || "Failed to upload slide image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p role="status">Loading slide...</p>;
  }

  if (error && !slide) {
    return (
      <section className="viewer-error-state" role="alert">
        <h3>Unable to load slide</h3>
        <p>{error}</p>
      </section>
    );
  }

  if (!slide) {
    return <p>Slide not found.</p>;
  }

  return (
    <main className="slide-details-page">
      <header className="slide-details-header">
        <p>DIGITAL PATHOLOGY</p>
        <h1>Slide Details</h1>
        <p>Slide ID: {slide.slideId || "—"}</p>
      </header>

      {error && (
        <p role="alert" className="slide-details-message">
          {error}
        </p>
      )}

      {uploadMessage && (
        <p role="status" className="slide-details-message">
          {uploadMessage}
        </p>
      )}

      <section
        ref={viewerRef}
        className={`slide-details-viewer${fullscreen ? " slide-details-viewer-fullscreen" : ""}`}
        aria-label="Digital pathology viewer workspace"
      >
        <SlideViewerToolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onFullscreen={handleFullscreen}
        />

        <SlideViewer
          slide={slide}
          zoom={zoom}
          onZoomChange={setZoom}
          imageUrl={imageUrl}
        />

        {!imageUrl && (
          <p className="slide-image-availability" role="note">
            {slide.image?.filename
              ? "Loading the attached image or checking image access..."
              : "No image uploaded yet. Upload a JPEG, PNG, or WebP image (maximum 10 MB)."}
          </p>
        )}

        <form
          className="slide-image-upload-form"
          onSubmit={handleUpload}
        >
          <label htmlFor="slide-image-file">Slide image</label>
          <input
            ref={fileInputRef}
            id="slide-image-file"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            required
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload image"}
          </button>
        </form>
      </section>

      <section className="slide-metadata-panel">
        <div className="slide-metadata-header">
          <p>RECORD INFORMATION</p>
          <h3>Slide Metadata</h3>
        </div>

        <div className="slide-metadata-list">
          <div className="slide-metadata-row">
            <span>Slide ID</span>
            <strong>{slide.slideId || "—"}</strong>
          </div>
          <div className="slide-metadata-row">
            <span>Slide Type</span>
            <strong>{slide.slideType || "—"}</strong>
          </div>
          <div className="slide-metadata-row">
            <span>Staining Method</span>
            <strong>{slide.stainingMethod || "—"}</strong>
          </div>
          <div className="slide-metadata-row">
            <span>Status</span>
            <strong>{slide.status || "—"}</strong>
          </div>
          <div className="slide-metadata-row">
            <span>Block</span>
            <strong>
              {slide.block?.blockId ||
                (typeof slide.block === "string" ? slide.block : "—")}
            </strong>
          </div>
          <div className="slide-metadata-row">
            <span>Case</span>
            <strong>
              {slide.case?.caseId ||
                (typeof slide.case === "string" ? slide.case : "—")}
            </strong>
          </div>
          <div className="slide-metadata-row">
            <span>Created</span>
            <strong>
              {slide.createdAt
                ? new Date(slide.createdAt).toLocaleString()
                : "—"}
            </strong>
          </div>
          <div className="slide-metadata-row">
            <span>Notes</span>
            <strong>{slide.notes || "—"}</strong>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SlideDetails;
