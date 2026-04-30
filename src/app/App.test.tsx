import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  function setInput(value: string) {
    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value },
    });
  }

  it("renders the formatter workspace with privacy chip", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Bad Formatter" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Browser-only/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Input")).toBeInTheDocument();
    expect(screen.getByLabelText("Output")).toBeInTheDocument();
  });

  it("beautifies valid JSON", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{"name":"Bad Formatter"}');
    await user.click(screen.getByRole("button", { name: /Beautify/i }));

    expect(screen.getByLabelText("Output")).toHaveValue(
      '{\n  "name": "Bad Formatter"\n}',
    );
    expect(screen.getByText("Valid JSON.")).toBeInTheDocument();
  });

  it("minifies valid JSON", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{\n  "name": "Bad Formatter"\n}');
    await user.click(screen.getByRole("button", { name: /Minify/i }));

    expect(screen.getByLabelText("Output")).toHaveValue(
      '{"name":"Bad Formatter"}',
    );
  });

  it("validates without changing existing output", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{"name":"Bad Formatter"}');
    await user.click(screen.getByRole("button", { name: /Beautify/i }));
    setInput('{"ok":true}');
    await user.click(screen.getByRole("button", { name: /Validate/i }));

    expect(screen.getByLabelText("Output")).toHaveValue(
      '{\n  "name": "Bad Formatter"\n}',
    );
    expect(screen.getByText("Valid JSON.")).toBeInTheDocument();
  });

  it("shows invalid JSON errors and preserves previous output", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{"name":"Bad Formatter"}');
    await user.click(screen.getByRole("button", { name: /Beautify/i }));
    setInput('{"name":}');
    await user.click(screen.getByRole("button", { name: /Validate/i }));

    expect(screen.getByText(/Invalid JSON:/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Output")).toHaveValue(
      '{\n  "name": "Bad Formatter"\n}',
    );
  });

  it("clear button clears the input only and reports it", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{"name":"Bad Formatter"}');
    await user.click(screen.getByRole("button", { name: /Beautify/i }));
    await user.click(screen.getByRole("button", { name: /Clear/i }));

    expect(screen.getByLabelText("Input")).toHaveValue("");
    expect(screen.getByLabelText("Output")).toHaveValue(
      '{\n  "name": "Bad Formatter"\n}',
    );
    expect(screen.getByText("Input cleared.")).toBeInTheDocument();
  });

  it("shows the initial ready prompt", () => {
    render(<App />);

    expect(
      screen.getByText(/Ready\. Paste JSON or load a sample\./i),
    ).toBeInTheDocument();
  });

  it("loads a sample JSON when Sample is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Sample/i }));

    const input = screen.getByLabelText("Input") as HTMLTextAreaElement;
    expect(input.value).toMatch(/Bad Formatter/);
    expect(
      screen.getByText(/Sample loaded\. Try Beautify or Validate\./i),
    ).toBeInTheDocument();
  });

  it("disables copy and download without output", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: /Copy/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Download/i })).toBeDisabled();
  });

  it("shows a collapsible tree view for object output", async () => {
    const user = userEvent.setup();
    render(<App />);

    setInput('{"project":{"name":"Bad Formatter"},"private":true}');
    await user.click(screen.getByRole("button", { name: /Beautify/i }));
    await user.click(screen.getByRole("button", { name: "Tree" }));

    expect(screen.getByLabelText("Output JSON tree")).toBeInTheDocument();
    expect(screen.getByText("Object(2)")).toBeInTheDocument();
    expect(screen.getByText('"project":')).toBeInTheDocument();
    expect(screen.queryByText('"name":')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /"project": Object\(1\)/ }),
    );

    expect(screen.getByText('"name":')).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /"project": Object\(1\)/ }),
    );

    expect(screen.queryByText('"name":')).not.toBeInTheDocument();
  });
});
