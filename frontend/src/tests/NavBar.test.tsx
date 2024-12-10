import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../pages/Navbar"; 

describe("Navbar Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Assert that navigation links are rendered
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Flashcard Sets")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
  });

  it("displays the username if stored in localStorage", () => {
    // Set a username in localStorage
    localStorage.setItem("username", "TestUser");

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Assert that the username is displayed
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  it("does not display a username if none is stored in localStorage", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Assert that no username is displayed
    expect(screen.queryByText("TestUser")).not.toBeInTheDocument();
  });
});
