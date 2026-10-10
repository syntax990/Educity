import React, { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = ({ courses, setCourses }) => {
  const [form, setForm] = useState({
    title: "",
    image: "",
    level: "",
    likes: "",
    duration: "",
    learners: "",
    certificate: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState("");

  const resetForm = () => {
    setForm({
      title: "",
      image: "",
      level: "",
      likes: "",
      duration: "",
      learners: "",
    });
    setIsEditing(false);
    setEditingId(null);
    setStatusMessage("");
    setImagePreviewError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageLoad = () => {
    setImagePreviewError("");
  };

  const handleImageError = () => {
    setImagePreviewError(
      "Image could not be loaded. Use a direct image URL from a trusted image host.",
    );
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setEditingId(course.id);
    setForm({
      title: course.title,
      image: course.image,
      level: course.level,
      likes: String(course.likes),
      duration: course.duration,
      learners: course.learners,
      certificate: course.certificate || false,
    });
    setStatusMessage("");
    setImagePreviewError("");
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/courses/${courseId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete course");
      }
      setCourses(courses.filter((course) => course.id !== courseId));
      resetForm();
      setStatusMessage("Course deleted successfully.");
    } catch (error) {
      console.error(error);
      setStatusMessage(error.message || "Failed to delete course.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      image: form.image.trim(),
      level: form.level.trim(),
      likes: Number(form.likes) || form.likes,
      duration: form.duration.trim(),
      learners: form.learners.trim(),
      certificate: Boolean(form.certificate),
    };

    if (
      !payload.title ||
      !payload.image ||
      !payload.level ||
      !payload.duration ||
      !payload.learners
    ) {
      setStatusMessage("Please fill every field before saving.");
      return;
    }

    try {
      const endpoint = isEditing
        ? `http://localhost:4000/api/courses/${editingId}`
        : "http://localhost:4000/api/courses";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to save course");
      }

      if (isEditing) {
        setCourses(
          courses.map((course) => (course.id === data.id ? data : course)),
        );
        setStatusMessage("Course updated successfully.");
      } else {
        setCourses([...courses, data]);
        setStatusMessage("Course added successfully.");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      setStatusMessage(error.message || "Failed to save course.");
    }
  };

  return (
    <section className="admin-panel">
      <h2>Admin Panel</h2>
      <p className="admin-note">
        Add, edit, or remove courses from the backend.
      </p>

      <div className="admin-grid">
        <div className="admin-form">
          <h3>{isEditing ? "Edit Course" : "Add New Course"}</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} />
            </label>
            <label>
              Image URL
              <input name="image" value={form.image} onChange={handleChange} />
              <small>
                Use a direct image URL (like an Unsplash image URL ending in
                .jpg or an image from images.unsplash.com).
              </small>
            </label>
            {form.image && (
              <div className="image-preview">
                <img
                  src={form.image}
                  alt="Preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {imagePreviewError && (
                  <p className="admin-image-error">{imagePreviewError}</p>
                )}
              </div>
            )}
            <label>
              Level
              <input name="level" value={form.level} onChange={handleChange} />
            </label>
            <label>
              Likes
              <input name="likes" value={form.likes} onChange={handleChange} />
            </label>
            <label>
              Duration
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
              />
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="certificate"
                checked={form.certificate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    certificate: event.target.checked,
                  }))
                }
              />
              Certificate available upon completion
            </label>
            <label>
              Learners
              <input
                name="learners"
                value={form.learners}
                onChange={handleChange}
              />
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn admin-save">
                {isEditing ? "Update Course" : "Add Course"}
              </button>
              <button
                type="button"
                className="btn admin-cancel"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
            {statusMessage && <p className="admin-status">{statusMessage}</p>}
          </form>
        </div>

        <div className="admin-list">
          <h3>Existing Courses</h3>
          <div className="admin-table">
            <div className="admin-row admin-header">
              <span>Title</span>
              <span>Level</span>
              <span>Actions</span>
            </div>
            {courses.map((course) => (
              <div className="admin-row" key={course.id}>
                <span>{course.title}</span>
                <span>{course.level}</span>
                <span className="admin-buttons">
                  <button
                    className="btn admin-edit"
                    type="button"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn admin-delete"
                    type="button"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
