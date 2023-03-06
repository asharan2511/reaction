import requestRange from "./requestRange.js";

test("should return default setting when range header is not present", () => {
  const headers = {};
  const fileSize = 100;
  const result = requestRange(headers, fileSize);
  expect(result).toEqual({
    end: fileSize,
    len: fileSize,
    partial: false,
    size: fileSize,
    start: 0,
    unit: "bytes"
  });
});

test("should return correct range when range header is present", () => {
    const headers = { range: "bytes=0-999" };
    const fileSize = 1000;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        end: "999",
        len: 999,
        partial: true,
        size: 1000,
        start: "0",
        unit: "bytes"
    });
});

test("should return the correct range when the range header request first half part of the file", () => {
    const headers = { range: "bytes=0-499" };
    const fileSize = 1000;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        end: "499",
        len: 499,
        partial: true,
        size: 1000,
        start: "0",
        unit: "bytes"
    });
});

test("should return error when range header is present but file size is not", () => {
    const headers = { range: "bytes=0-10" };
    const fileSize = null;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        errorCode: 416,
        errorMessage: "Requested Range Not Satisfiable (Unknown File Size)"
    });
});

test("should return error when range header is present but invalid", () => {
    const headers = { range: "bytes" };
    const fileSize = 100;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        errorCode: 416,
        errorMessage: "Requested Range Unit Not Satisfiable"
    });
})

test('should return error when range header is present but unit is not a "bytes"', () => {
    const headers = { range: "k_bytes=0-10" };
    const fileSize = 100;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        errorCode: 416,
        errorMessage: "Requested Range Unit Not Satisfiable"
    });
});

test("should return error when range header is present but start is greater than end", () => {
    const headers = { range: "bytes=10-0" };
    const fileSize = 100;
    const result = requestRange(headers, fileSize);
    expect(result).toEqual({
        errorCode: 416,
        errorMessage: "Requested Range Not Satisfiable"
    });
});
