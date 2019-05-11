<template>
	<div class="blog-post-creator rteditor">
		<Button class="preview-btn" @click="showPreview">See Preview</Button>
		<div class="post-inputs">
			<div class="text-input">
				<error v-if="!title && formEntered">Title must be more than 10 characters.</error>
				<div class="input-container">
					<span class="input-label">Post Title</span>
					<Input v-model="title" placeholder="Post Title"/>
				</div>
			</div>
			<div class="select-input">
				<error v-if="!category && formEntered">Post must have a category</error>

				<span class="input-label">Post Topic Category</span>
				<Select
					placeholder="Select a category"
					v-model="category"
					v-if="postCategories.length"
				>
					<Option
						v-for="(cat, index) in postCategories"
						:key="index"
						:value="cat.id">
						{{cat.label}}
					</Option>
				</Select>
			</div>
			<div class="keyword-input">
				<div class="text-input">
					<error v-if="!keyword1 && formEntered">Keyword 1 must exist</error>
					<div class="input-container">
						<span class="input-label">First Keyword(s)</span>
						<Input v-model="keyword1" placeholder="First Keyword(s)"/>
					</div>
				</div>

				<div class="text-input">
					<error v-if="!keyword2 && formEntered">Keyword 2 must exist</error>
					<div class="input-container">
						<span class="input-label">Second Keyword(s)</span>
						<Input v-model="keyword2" placeholder="Second Keyword(s)"/>
					</div>
				</div>
				<div class="image-input">
					<error v-if="!image_url && formEntered">Post must have an image</error>
					<div class="inner-image-input">
						<img :src="image_url || `https://utmsi.utexas.edu/components/com_easyblog/themes/wireframe/images/placeholder-image.png`" width="40px" height="40px" />

						<div class="input-container">
							<span class="input-label">Image Url</span>
							<Input type="text" v-model="image_url" />
						</div>
					</div>
				</div>
			</div>
			<div class="text-input">
				<div class="input-container">
					<span class="input-label">Generated Meta Title</span>
					<Input :value="metaTitle"/>
				</div>
				<div class="rule-validator">
					<span class="rule"
						v-for="(rule, key) in titleRules"
						:key="key"
						:class="rule.isValid(metaTitle) ? 'valid' : 'invalid'"
					>
						<div
							v-if="rule.isValid(metaTitle)"
							v-html="successSVG"
							class="indicator"
						>
						</div>
						<div
							v-else
							class="indicator"
							v-html="failureSVG">
						</div>
						<p>{{ rule.text }}</p>
					</span>
				</div>
			</div>
			<div class="text-input">
				<error v-if="!description && formEntered">Description must be more than 20 characters.</error>
				<div class="input-container">
					<span class="input-label">Meta Description</span>
					<Input v-model="description" placeholder="Meta Description"/>
				</div>
				<div class="rule-validator">
					<span
						class="rule"
						v-for="(rule, key) in descriptionRules"
						:key="key"
						:class="rule.isValid(description) ? 'valid' : 'invalid'"
					>
						
						<div
							class="indicator"
							v-if="rule.isValid(metaTitle)"
							v-html="successSVG"
						>
						</div>
						<div
							class="indicator"
							v-else
							v-html="failureSVG">
						</div>
						<p>{{ rule.text }}</p>
					</span>
				</div>
			</div>
		</div>
		<quill-editor
			v-model="content"
			ref="myQuillEditor"
			:options="editorOption"
		/>
		<div class="rule-validator">
			<span
				class="rule"
				v-for="(rule, key) in postRules"
				:key="key"
				:class="rule.isValid(content) ? 'valid' : 'invalid'"
			>
				
				<div
					class="indicator"
					v-if="rule.isValid(content)"
					v-html="successSVG"
				>
				</div>
				<div
					class="indicator"
					v-else
					v-html="failureSVG">
				</div>
				<p>{{ rule.text }}</p>
			</span>
		</div>
		<div class="post-actions-row">
			<Button class="btn-delete" @click="del">Delete</Button>
			<Button type="primary" @click="save">Save</Button>
			<Button type="primary" @click="publish">Publish</Button>	
		</div>
	</div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'
import { Button, Input, Select, Option } from 'iview'
import { mapGetters } from 'vuex'
import Error from './Error.vue'

export default {
	name: 'HelloWorld',
	components: {
		Button,
		Input,
		Select,
		Error,
		quillEditor,
		Option
	},
	data: function () {
		return {
			title: '',
			description: '',
			keyword1: '',
			keyword2: '',
			category: '',
			successSVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="green" height="17px" viewBox="0 0 480 480" width="17px"><path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm0 464c-123.710938 0-224-100.289062-224-224s100.289062-224 224-224 224 100.289062 224 224c-.140625 123.652344-100.347656 223.859375-224 224zm0 0"/><path d="m346.34375 154.34375-154.34375 154.34375-58.34375-58.34375c-3.140625-3.03125-8.128906-2.988281-11.214844.097656-3.085937 3.085938-3.128906 8.074219-.097656 11.214844l64 64c3.125 3.121094 8.1875 3.121094 11.3125 0l160-160c3.03125-3.140625 2.988281-8.128906-.097656-11.214844-3.085938-3.085937-8.074219-3.128906-11.214844-.097656zm0 0"/></svg>`,
			failureSVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="red" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 76 76" style="enable-background:new 0 0 76 76;" xml:space="preserve" width="17px" height="17px"> <g id="_x37_7_Essential_Icons_8_"> <path id="Cancel" d="M38,0C17,0,0,17,0,38s17,38,38,38s38-17,38-38S59,0,38,0z M38,72C19.2,72,4,56.8,4,38S19.2,4,38,4   s34,15.2,34,34S56.8,72,38,72z M40.8,38l12.6-12.6c0.8-0.8,0.8-2,0-2.8s-2-0.8-2.8,0L38,35.2L25.4,22.6c-0.8-0.8-2-0.8-2.8,0   s-0.8,2,0,2.8L35.2,38L22.6,50.6c-0.8,0.8-0.8,2,0,2.8s2,0.8,2.8,0L38,40.8l12.6,12.6c0.8,0.8,2,0.8,2.8,0s0.8-2,0-2.8L40.8,38z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>`,
			image_url: '',
			content: '',
					editorOption: {
							debug: 'info',
							placeholder: 'Type your post...',
							readOnly: true,
							theme: 'snow'
			},
			postCategories: [
				{
					id: 1,
					label:'NodeJS',
					img:'https://pluralsight.imgix.net/paths/path-icons/nodejs-601628d09d.png?w=200'
				},
				{
					id: 2,
					label:'JavaScript',
					img:'https://cdn.auth0.com/blog/js-fatigue/JSLogo.png'
				}
			],
			showImageModal: false,
			formEntered: false,
			mounting: false,
			brand: 'Lavish Web',
			titleRules: {
				titleLength: {
					text: 'Title should be between 50 and 60 characters',
					isValid: ({ length }) => length >= 50 && length <= 60
				},
				titleFormat: {
					text: 'Title should be in this format <Primary Keyword - Secondary Keyword | Brand Name>',
					isValid: (title) => title.match(/[\w\s']*-\s[\w\s]*\|\s[\s\w]*$/)
				},
				brandInTitle: {
					text: 'Brand should be included in title',
					isValid: (title) => {
						return title.includes(this.brand)
					}
				}
			},
			descriptionRules: {
				descriptionLength: {
					text: 'Description should be between 50 and 160 characters',
					isValid: ({ length }) => length >= 50 && length <= 60
				},
				descriptionKeyWords: {
					text: 'Text should contain keywords from title',
					isValid: (desc) => desc.includes(this.keyword1) && desc.includes(this.keyword2)
				},
				brandInDescription: {
					text: 'Brand should be in description',
					isValid: (desc) => desc.includes(this.brand)
				}
			},
			postRules: {
				firstKeyword: {
					text: 'Should contain first keyword in first few sentences.',
					isValid: () =>
						this.content.split('.').slice(0,3).reduce((acum, iter, idx) => {
							return idx < 3 && iter.includes(this.keyword1)
						}, false)
				},

				secondKeyword: {
					text: 'Should contain second keyword in first few sentences.',
					isValid: () =>
						this.content.split('.').slice(0,3).reduce((acum, iter, idx) => {
							return acum = idx < 3 && iter.includes(this.keyword2)
						}, false)
				}
			}
		}
	},
	watch: {
		content (val) {
			if (!this.mounting) {
				this.$store.commit('setDelta', this.$refs.myQuillEditor.quill.getContents())
			}
			this.$store.commit('setContent', val)
			this.mounting = false
		}
	},
	methods: {
		showPreview () {
			this.$router.replace('/preview')
		},
		del () {
			// TODO
			this.formEntered = true
		},
		save () {
			// TODO
			this.formEntered = true
		},
		publish () {
			// TODO
			this.formEntered = true
		}
	},
	computed: {
		...mapGetters(['delta', 'contents']),
		metaTitle () {
			return `${this.keyword1} - ${this.keyword2} | ${this.brand}`
		}
	},
	mounted () {
		this.mounting = true
		if (!this.content && this.contents) {
			this.content = this.contents
		}
	}
}
</script>
<style lang="scss" scoped>

.preview-btn {
	margin-top: 20px;
}

.keyword-input {
	display: flex;
	.ivu-input {
		width: 100%;
	}
	.text-input,
	.inner-image-input .input-container {
		margin-top: 20px;
	}
}

.indicator {
	margin-right: 5px;
}

.rule-validator {
	padding: 15px;
	border: 1px solid #999;
	border-radius: 4px;
	background: #f3f3f3;
	font-size: 14px;
	margin-bottom: 10px;
	margin-top: 10px;

	.rule {
		padding-top: 2px;
		padding-bottom: 2px;
		display: flex;
	}
	.valid {
		color: green
	}
	.invalid {
		color: red;
	}
}

.rteditor {
  margin-left: 20px;
  margin-right: 20px;
}

.select-input, .text-input {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 5px;
	margin-top: 20px;
	margin-right: 10px;
}

.post-inputs {
	padding-bottom: 15px;
	padding-top: 15px;
	/* padding: 20px; */
}

/deep/ .ql-container {
	height: 72vh;
}

.image-input {
	height: 70px;
	img {
		height: 90px;
    width: 90px;
    margin-top: 10px;
	}

}

.inner-image-input {
	display: flex;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.post-actions-row {
	display: flex;
	justify-content: space-between;
	padding: 10px;
}

.ivu-icon-ios-camera-outline {
	font-size: 16px;
}

.btn-delete {
	color: #2d8cf0!important;
	border: 1px solid #2d8cf0!important;
}

.btn-delete:hover {
	color: red!important;
	border: 1px solid red!important;
}

/deep/ .ql-toolbar {
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;
}

/deep/ .ql-container {
	border-bottom-right-radius: 4px;
	border-bottom-left-radius: 4px;
}


</style>
