import { Markdown } from "@/components/markdown";

const SAMPLE = `# H1 Title

Paragraph with **bold**, *italic*, \`inline code\`, ~~struck~~ and a [good link](https://example.com).

A [bad link](javascript:alert(1)) and an [xss attempt](data:text/html,<script>1</script>).

## H2

### H3

#### H4

##### H5

###### H6

- alpha
- beta

1. one
2. two

> quoted line
> second line

| Col A | Col B |
| --- | --- |
| 1 | 2 |
| 3 | 4 |

\`\`\`ts
const x: number = 1;
\`\`\`

---

Text after rule.
`;

export default function MdCheck() {
  return <main id="mdcheck">{Markdown({ source: SAMPLE })}</main>;
}
