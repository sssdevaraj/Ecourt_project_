export const formatDate = (isoString) => {
    if (!isoString) return "N/A"; // Handle empty values
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  