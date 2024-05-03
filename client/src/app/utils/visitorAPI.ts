import VisitorAPI from "visitorapi";

export const getVisitorData = async () => {
  const projectId = process.env.NEXT_PUBLIC_VISITOR_PROJECT_ID;
  return new Promise((resolve, reject) => {
    try {
      VisitorAPI(projectId, (data) => {
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};
