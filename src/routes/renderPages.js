// Custom Express router for handling all GET requests.

const express = require("express");
const {
  getAllMaterials,
  getUserSubmissions,
  getSpecificPost,
} = require("../queriesSQL/resourceQueries");
const router = express.Router();
const { pool } = require("../DB/pool");
const { getUserInfo } = require("../../src/queriesSQL/userQueries");

router.get("/", (req, res) => {
  try {
    res.status(200).render("home", { loggedIn: req.userLoggedIn });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to access this page: " + error,
    });
  }
});

router.get("/register", (req, res) => {
  try {
    if (!req.userLoggedIn) {
      return res.render("register", { loggedIn: req.userLoggedIn });
    }
    return res.redirect("/myAccount");
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to access this page: " + error,
    });
  }
});

router.get("/login", (req, res) => {
  try {
    if (!req.userLoggedIn) {
      return res.render("login", { loggedIn: req.userLoggedIn });
    }
    return res.redirect("/myAccount");
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to access this page: " + error,
    });
  }
});

router.get("/error", (req, res) => {
  try {
    res.render("error", { loggedIn: req.userLoggedIn });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to access this page: " + error,
    });
  }
});
router.get("/myAccount", async (req, res) => {
  try {
    if (req.userLoggedIn) {
      const submissions = await getUserSubmissions(pool, req.user);
      return res.render("myAccount", {
        loggedIn: req.userLoggedIn,
        user: req.user,
        submissions,
      });
    }

    return res.redirect("/notLoggedIn");
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to access your account: " + error,
    });
  }
});
router.get("/postResource", (req, res) => {
  try {
    if (req.userLoggedIn) {
      return res.render("postResource", { loggedIn: req.userLoggedIn });
    }
    return res.redirect("/notLoggedIn");
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to post a new study material: " + error,
    });
  }
});

router.get("/allResources", async (req, res) => {
  try {
    const studyMaterials = await getAllMaterials(pool);
    let adjustedStudyMaterials = [];
    for (let element of studyMaterials) {
      if (element.username === req.user) {
        element.isCreator = true;
      }
      adjustedStudyMaterials.push(element);
    }

    res.render("allResources", {
      loggedIn: req.userLoggedIn,
      studyMaterials: adjustedStudyMaterials,
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while fetching the available study materials: " +
        error,
    });
  }
});

router.get("/notLoggedIn", (req, res) => {
  try {
    if (!req.userLoggedIn) {
      return res.render("notLoggedIn", { loggedIn: req.userLoggedIn });
    }
    return res.redirect("/myAccount");
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage: "An error occurred: " + error,
    });
  }
});

router.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    if (req.userLoggedIn && req.user === username) {
      return res.redirect("/myAccount");
    }
    const userInfo = await getUserInfo(pool, username);
    if (userInfo.length === 0) {
      return res.render("error", {
        errorMessage: `User ${username} doesn't exist.`,
        loggedIn: req.userLoggedIn,
      });
    }
    res.render("specificUser", { loggedIn: req.userLoggedIn, userInfo });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to view this account: " + error,
    });
  }
});

router.get("/posts/:id", async (req, res) => {
  const postName = req.params.id;
  try {
    const postInfo = await getSpecificPost(pool, postName);
    const isCreator = postInfo[0].username == req.user;
    postInfo[0].isCreator = isCreator;
    res.render("specificPost", { loggedIn: req.userLoggedIn, postInfo });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to view this post: " + error,
    });
  }
});

router.get("/posts/:id/delete", async (req, res) => {
  if (!req.userLoggedIn) {
    return res.render("notLoggedIn");
  }
  try {
    const postInfo = await getSpecificPost(pool, req.params.id);
    const postCreator = postInfo[0].username;
    if (postCreator !== req.user) {
      return res.render("error", {
        loggedIn: req.userLoggedIn,
        errorMessage:
          "You are not the creator of this post, so you are not allowed to modify it.",
      });
    }
    res.render("deletePost", { loggedIn: req.userLoggedIn, postInfo });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to delete this post: " + error,
    });
  }
});

router.get("/posts/:id/edit", async (req, res) => {
  if (!req.userLoggedIn) {
    return res.render("notLoggedIn");
  }
  try {
    const postInfo = await getSpecificPost(pool, req.params.id);
    const postCreator = postInfo[0].username;
    if (postCreator !== req.user) {
      return res.render("error", {
        loggedIn: req.userLoggedIn,
        errorMessage:
          "You are not the creator of this post, so you are not allowed to modify it.",
      });
    }
    res.render("postResource", { loggedIn: req.userLoggedIn, postInfo });
  } catch (error) {
    console.error(error);
    res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "An error occurred while trying to edit this publication: " + error,
    });
  }
});

router.get("/users/:id/delete", async (req, res) => {
  if (!req.userLoggedIn) {
    return res.render("notLoggedIn");
  }
  if (req.params.id !== req.user) {
    return res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage: "You must be signed into this account to modify it",
    });
  }
  try {
    const userInfo = await getUserInfo(pool, req.params.id);
    if (!userInfo) {
      return res.render("error", {
        loggedIn: req.userLoggedIn,
        errorMessage: "A problem occurred while accessing this account",
      });
    }
    res.render("deleteAccount", { loggedIn: req.userLoggedIn, userInfo });
  } catch (error) {
    console.error(error);
    return res.render("error", {
      loggedIn: req.userLoggedIn,
      errorMessage:
        "A problem occurred while accessing this account - " + error,
    });
  }
});

router.get("*", (req, res) => {
  try {
    return res.render("error", {
      errorMessage: `The page you are looking for does not exist.`,
      loggedIn: req.userLoggedIn,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error ocurred while rendering this page :" + error);
  }
});

module.exports = router;
