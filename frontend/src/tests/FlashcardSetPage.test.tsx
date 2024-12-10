import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FlashcardSetPage from "../pages/FlashcardSetPage";
import {
  fetchSets,
  createSet,
  fetchFlashcardSet,
  createFlashcard,
  deleteSet,
} from "../utils/api";

jest.mock("../utils/api", () => ({
  fetchSets: jest.fn(),
  createSet: jest.fn(),
  fetchFlashcardSet: jest.fn(),
  createFlashcard: jest.fn(),
  deleteSet: jest.fn(),
}));

describe("FlashcardSetPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with initial state", async () => {
    (fetchSets as jest.Mock).mockResolvedValue([]);

    render(<FlashcardSetPage />);

    expect(screen.getByPlaceholderText(/Enter set name/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Set/i)).toBeInTheDocument();

    await waitFor(() => expect(fetchSets).toHaveBeenCalledTimes(1));
  });

  test("adds a new set", async () => {
    (createSet as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Test Set",
    });

    render(<FlashcardSetPage />);

    fireEvent.change(screen.getByPlaceholderText(/Enter set name/i), {
      target: { value: "Test Set" },
    });
    fireEvent.click(screen.getByText(/Create Set/i));

    await waitFor(() => expect(createSet).toHaveBeenCalledWith({ name: "Test Set", userId: "" }));
    await waitFor(() => expect(screen.getByText(/Test Set/i)).toBeInTheDocument());
  });

  test("fetches flashcards when a set is selected", async () => {
    (fetchFlashcardSet as jest.Mock).mockResolvedValue([
      { id: 1, question: "Q1", solution: "A1", difficulty: "easy", setId: 1 },
    ]);

    (fetchSets as jest.Mock).mockResolvedValue([
      { id: 1, name: "Test Set" },
    ]);

    render(<FlashcardSetPage />);

    await waitFor(() => expect(fetchSets).toHaveBeenCalled());

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    await waitFor(() => expect(fetchFlashcardSet).toHaveBeenCalledWith(1));
    expect(screen.getByText(/Q1/i)).toBeInTheDocument();
  });

  test("deletes a set", async () => {
    (fetchSets as jest.Mock).mockResolvedValue([{ id: 1, name: "Test Set" }]);
    (deleteSet as jest.Mock).mockResolvedValue([{setId:1}]);

    render(<FlashcardSetPage />);

    await waitFor(() => expect(fetchSets).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => expect(deleteSet).toHaveBeenCalledWith(1));
    expect(screen.queryByText(/Test Set/i)).not.toBeInTheDocument();
  });
});
