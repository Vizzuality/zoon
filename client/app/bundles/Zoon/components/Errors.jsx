import React from "react"

export default ({ errors }) => (
  <div>
    {Object.keys(errors || []).map((key) => (
      errors[key].map((error) => (
        <p className="error">{key}: {error}</p>
      ))
    ))}
  </div>
)
