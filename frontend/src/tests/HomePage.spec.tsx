// import React from "react";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { BrowserRouter } from "react-router-dom";
// import HomePage from "../pages/HomePage"; 
// import { useNavigate } from "react-router-dom";

// // Mock the `useNavigate` function
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: jest.fn(),
// }));

// describe("HomePage", () => {
//   it("renders the homepage with buttons and text", () => {
//     render(
//       <BrowserRouter>
//         <HomePage />
//       </BrowserRouter>
//     );

//     // Assert that the header, description, and buttons are rendered
//     expect(screen.getByText("Welcome to TestVar Flashcards")).toBeInTheDocument();
//     expect(screen.getByText("Create your own flashcard sets and collections!")).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: "Go to Flashcard Sets" })).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: "Go to Collections" })).toBeInTheDocument();
//   });

//   it("navigates to Flashcard Sets page when the button is clicked", () => {
//     const mockNavigate = jest.fn();
//     (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

//     render(
//       <BrowserRouter>
//         <HomePage />
//       </BrowserRouter>
//     );

//     // Simulate a click on the Flashcard Sets button
//     const flashcardSetsButton = screen.getByRole("button", { name: "Go to Flashcard Sets" });
//     userEvent.click(flashcardSetsButton);

//     // Assert that `useNavigate` was called with the correct path
//     expect(mockNavigate).toHaveBeenCalledWith("/flashcard-sets");
//   });

//   it("navigates to Collections page when the button is clicked", () => {
//     const mockNavigate = jest.fn();
//     (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

//     render(
//       <BrowserRouter>
//         <HomePage />
//       </BrowserRouter>
//     );

//     // Simulate a click on the Collections button
//     const collectionsButton = screen.getByRole("button", { name: "Go to Collections" });
//     userEvent.click(collectionsButton);

//     // Assert that `useNavigate` was called with the correct path
//     expect(mockNavigate).toHaveBeenCalledWith("/collections");
//   });
// });
