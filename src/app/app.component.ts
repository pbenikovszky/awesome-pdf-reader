import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedFile: File
  public form: FormGroup
  public words: string[] = []

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dateRange: [[null, null], []]
    })
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
    }
  }

  public async onSubmit() {
    if (this.selectedFile) {
      const arrayBuffer = await this.selectedFile.arrayBuffer()
      const pdf = await (window as any).pdfjsLib.getDocument({
        data: arrayBuffer
      }).promise
      const maxPages = pdf.numPages

      this.words = []
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const content = await page.getTextContent()
        this.words.push(
          ...content.items
            .map((item) => item.str)
            .filter((word: string) => word?.length > 0 && word != ' ')
        )
      }
      console.log(this.words)
    } else {
      this.words = ['No file selected']
      console.log('No file selected.')
    }
  }
}
