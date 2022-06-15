# Change Log

All notable changes to the "CSV to Markdown Table" extension will be documented in this file.

## [0.3.0] - 2022-06-15

- Added : A new align feature
  - If `csvToMdTable.numberAlignRight` config value is true, the cells with numbers would align to the right.
- Fixed : A bug that newlines is not converted
- Updated : Internal dependencies

## [0.2.2] - 2022-01-21

- Updated : Internal dependencies

## [0.2.1] - 2021-07-21

- Fixed : Deconverting with `; (semicolon)` delimiter, but `, (comma)` delimiter is used

## [0.2.0] - 2021-07-20

- Added : `Convert Markdown table to CSV with Delimiter...` command that can use other delimiter to convert
- Changed : Command id changed to `csvToMdTable.deconvertSelection` from `csvToMdTable.reverseConvertSelection`

## [0.1.0] - 2021-07-19

- Initial release
