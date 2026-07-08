# MCP Trust Report: github:larksuite/lark-openapi-mcp

**Decision:** APPROVE_WITH_RESTRICTIONS  
**Risk:** MEDIUM  
**Score:** 40/100  
**Confidence:** 66%

_Resolved ref: `21920354ec6e3966b52e89152620c5085e496b55`_

## Executive Summary
This MCP server looks usable **with restrictions** (sandboxing, least privilege, scoped access). Review the findings and apply the recommended policy.

## Decision Reasons
- Overall score 40 falls in MEDIUM band

## Coverage
| Check | State |
|---|---|
| configScan | not_available |
| staticScan | completed |
| capabilityInference | static_only |
| introspection | disabled |
| semgrep | completed |
| docker | disabled |
| dependencyScan | not_available |
| runtimeScan | not_available |
| packageMetadata | completed |

## Capability Map
_Source: static_inference_

_No tools discovered (no runtime introspection); capabilities inferred statically where possible._

## Subscores
| Subscore | Value |
|---|---|
| capability | 0 |
| code | 95 |
| config | _not assessed_ |
| supplyChain | 0 |
| dependency | _not assessed_ |
| authTransport | _not assessed_ |
| metadata | 100 |
| maintainer | _not assessed_ |
| runtime | _not assessed_ |

## Findings (48)
### HIGH (1)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** high  **Confidence:** 85%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/logger.ts:48`

```
fs.unlinkSync(path.join(ENV_PATHS.log, file));
```

**Impact:** File deletion can destroy data outside the intended directory. The argument appears to be dynamically constructed, raising injection risk.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

### MEDIUM (39)
#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/auth/utils/storage-manager.ts:104`

```
fs.writeFileSync(this.storageFile, encryptedData);
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-CODE-006: Arbitrary filesystem write or delete
**Severity:** medium  **Confidence:** 70%  **Category:** code

Writes or deletes files, potentially outside a scoped workspace.

**Evidence:** `src/utils/logger.ts:64`

```
fs.appendFileSync(
```

**Impact:** File writes can modify data; a dynamic path can write outside the intended directory.

**Remediation:** Constrain writes/deletes to a validated workspace directory; never delete based on unvalidated input.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/approval_v4.ts`

```
Key:Value of the text. The key needs to start with @i18n@ and the value must be passed in according to the requirements of each parameter.**Description**: This field is mainly used for internationaliz
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/approval_v4.ts`

```
The department ID type in this call. For a detailed description of department IDs, see [Department ID Description]. Options:department_id(DepartmentId Supports user-defined department ID. When customi
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/approval_v4.ts`

```
Approval instance extension parameter, JSON format, needs to be compressed and escaped into a string when passing the value. The document number is realized by passing the business_key parameter.**Not
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/base_v2.ts`

```
A readable view collection. This is only meaningful when view_perm is 1. If it is not set, all views are readable. If it is set, it means that only views in the collection are readable, and views outs
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/base_v2.ts`

```
base role`base_complex_edit`: Set whether you can create copies, download, and print multidimensional tables`copy`: Set whether you can copy the contents of multidimensional tablesThe parameter type i
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
The department ID type in this call. For a detailed description of department IDs, see [Department ID Description]. Options:department_id(Supports user-defined department ID. When customizing the conf
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
Language version. Optional values ​​are:- zh_cn: Chinese- en_us: English- ja_jp: Japanese
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
Job family name. Unique within a tenant. Values ​​can be in Chinese, English, and symbols.**Default value**: empty, meaning no update
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
Work city. The maximum character length is 100.- You can call the [Get tenant work city list] interface to obtain the existing work city names in the current tenant.- If the working city name you pass
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
Job title. The maximum number of characters is 255.- You can call the [Get tenant job title list] interface to obtain the corresponding tenant name.- If the job title passed in does not exist, the sys
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/contact_v3.ts`

```
Work city. The maximum character length is 100.- Call [Get tenant work city list] to get the list of existing work cities in the current tenant.- If the work city name you pass in does not exist, the 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v1.ts`

```
Department I. ID acquisition:- Call [create department][search department] and other interfaces to return the department ID- You can also create departments through [[Event]Create departments](https:/
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v1.ts`

```
Field value, which is the string escaped by json, according to the metadata definition, the field format is different (such as 123, 123.23, "true", [\\ "id1\\",\\ "id2\\"], "2006-01-02 15:04:05")- See
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v1.ts`

```
The job ID that needs to be deleted. How to get the ID:- Call [Create job] [Batch query job] to return job ID- You can also create jobs through [[Event]Create Jobs](https://open.feishu.cn/document/uAj
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v1.ts`

```
Job ID. How to get ID:- Call [Create job] [Batch query job] to return job ID- You can also create jobs through [Event] [Event] Update jobs] (https://open.feishu.<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
List of country/region IDs, which can be obtained through the [Query country/region information] (https://open.feishu.<redacted:high-entropy> - country_region/search) in
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
Department ID list. ID acquisition:- Call [create department][search department] and other interfaces to return the department ID- You can also create departments through [[Event]Create Department](ht
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
Department ID list, ID acquisition method:- Call [Create Department] or [Search Department]for the department interface can return the department ID.- You can also get the department ID by [[Event]Cre
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
Job ID. How to get ID:- Call [Create job] [Batch query job] to return job ID- You can also create jobs through [[Event]Create jobs](https://open.feishu.<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
The field value is a string escaped from JSON. The field format varies depending on the metadata definition, for example: - Text type (1): "text" - Boolean type (2): "true" - Number type (3): "123" - 
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
City, you can get details through the interface [Query city information] (https://open.feishu.<redacted:high-entropy> -city/search)
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
District/county, you can get details through the interface [Query District/County Information] (https://open.feishu.<redacted:high-entropy> -district/search)
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/corehr_v2.ts`

```
The list of personal information IDs can be obtained through [[Event] Update personal information] (https://open.feishu.<redacted:high-entropy>)
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/drive_v1.ts`

```
The title of the new version of the document. The maximum length is 1024 Unicode code points. Generally, one English or Chinese character corresponds to one code point, but some special symbols may co
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/im_v1.ts`

```
Keyword. **Notes**:- The keyword supports matching the internationalized name of the group and the name of the group member.- Supports searching in multiple languages (Multiple languages ​​supported i
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/im_v1.ts`

```
Container ID. The ID type is the same as the value of container_id_type.- For how to obtain the ID of a group chat or a single chat, see [Group ID Description].- For how to obtain the topic ID, see th
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/im_v1.ts`

```
Message card content. Cards constructed with Card JSON or the [Card building tool] are supported. - To use card JSON, refer to [card JSON structure]. When passing the value, you need to compress and e
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/im_v1.ts`

```
The ID of the thread to be forwarded. For how to obtain it, see the **How ​​to obtain thread_id** section in [Thread Overview]
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/payroll_v1.ts`

```
Data source code. External data source configuration information can be obtained from [https://open.feishu.<redacted:high-entropy>]Or on the "Feishu Personnel Bac
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/search_v2.ts`

```
Options:user_id(UserID 用户在租户内的身份ID，详细说明请参考：https://open.feishu.cn/document/home/user-identity-introduction/introduction),open_id(OpenID 用户在应用内的身份ID，详细说明请参考：https://open.feishu.cn/document/home/user-id
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/sheets_v3.ts`

```
Sheet token,[how to get related cloud document resources]((https://open.feishu.<redacted:high-entropy>))
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/sheets_v3.ts`

```
Spreadsheet token. Ways to get: - Through the URL of the sheet: https://sample.feishu.cn/sheets/==shtcnmBAyGehy8abcef==- Through the [List items in folder] API (https://open.feishu.cn/document/uAjLw4C
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/en/gen-tools/zod/wiki_v2.ts`

```
When querying **My Document Library**​​, specify the document library name display language to return. Options:zh(LangZH Simplified Chinese),id(LangID Indonesian),de(LangDE German),en(LangEN English),
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/zh/gen-tools/zod/drive_v1.ts`

```
创建的版本文档的标题。最大长度 1024 个 Unicode 码点。通常情况下，一个英文或中文字符对应一个码点，但是某些特殊符号可能会对应多个码点。例如，家庭组合「👨‍👩‍👧」这个表情符号对应 5 个码点。**注意**：该参数必填，请忽略左侧必填列显示的“否”
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** medium  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions.

**Evidence:** `src/mcp-tool/tools/zh/gen-tools/zod/search_v2.ts`

```
权限值类型 Options:user_id(UserID 用户在租户内的身份ID，详细说明请参考：https://open.feishu.cn/document/home/user-identity-introduction/introduction),open_id(OpenID 用户在应用内的身份ID，详细说明请参考：https://open.feishu.cn/document/home/u
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/http-instance.ts:14`

```
export const commonHttpInstance = axios.create({ proxy: false, httpAgent: proxyAgent, httpsAgent: proxyAgent });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

#### MCP-SG-JS-005: Outbound request with dynamic URL (SSRF / exfiltration)
**Severity:** medium  **Confidence:** 60%  **Category:** code

A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Evidence:** `src/utils/http-instance.ts:17`

```
export const oapiHttpInstance = axios.create({ proxy: false, httpAgent: proxyAgent, httpsAgent: proxyAgent });
```

**Impact:** A caller-controlled URL can reach internal services or exfiltrate data. Note — almost every MCP server makes outbound requests; this is reported as evidence (medium) but does not by itself force NEEDS_REVIEW. Real SSRF needs the URL to come from tool input.

**Remediation:** Validate URLs against an allowlist of hosts/schemes before making outbound requests.

### LOW (7)
#### MCP-META-005: Encoded or hidden content in metadata
**Severity:** low  **Confidence:** 65%  **Category:** metadata

Metadata contains zero-width/bidi control characters or long encoded payloads that can hide instructions. (Severity reduced medium→low: this match is in test code — tests/auth/utils/pkce.test.ts — which does not run as part of the MCP server.)

**Evidence:** `tests/auth/utils/pkce.test.ts`

```
<redacted:high-entropy>
```

**Impact:** Hidden or encoded content can smuggle instructions past human review.

**Remediation:** Strip and inspect hidden/encoded content. Reject metadata containing zero-width or bidi control characters.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/constants.ts:24`

```
appSecret: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/constants.ts:25`

```
userAccessToken: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `src/utils/constants.ts:26`

```
tokenMode: <redacted:secret>,
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/utils/constants.test.ts:41`

```
delete process.env.APP_SECRET;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/utils/constants.test.ts:42`

```
delete process.env.USER_ACCESS_TOKEN;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

#### MCP-CODE-007: Secret-like environment variable access
**Severity:** low  **Confidence:** 60%  **Category:** code

Reads environment variables whose names imply secrets (tokens, keys, passwords). Reading credentials from the environment is normal configuration; this is an informational capability signal, not a vulnerability by itself.

**Evidence:** `tests/utils/constants.test.ts:43`

```
delete process.env.LARK_TOKEN_MODE;
```

**Impact:** The server reads credentials from the environment (credential_access capability); a concern only if they are logged or sent externally.

**Remediation:** Confirm the server needs these secrets; scope tokens narrowly and never log them.

### INFO (1)
#### MCP-SUPPLY-005: No security policy (SECURITY.md) found
**Severity:** info  **Confidence:** 100%  **Category:** supply_chain

The project does not provide a security policy. This is a maturity/best-practice gap, not a vulnerability — reported informational so it never drives the decision.

**Evidence:** `repo.files`

```
no SECURITY.md found in source
```

**Impact:** Absence of a disclosure process slows remediation of future vulnerabilities.

**Remediation:** Prefer projects that publish a SECURITY.md with a vulnerability disclosure process.


## Recommended Policy
- Run only in a sandbox with least-privilege configuration.

## Disclaimer
> MCP Trust provides evidence-based risk assessment. It does not guarantee that a server is safe or malicious. Use results as input to security review, sandboxing and policy decisions.

_Generated by mcp-trust 0.5.3 at 2026-07-08T15:50:27.803Z._
