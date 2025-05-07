<?php

namespace App\Entity;

use App\Repository\TestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TestRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Test
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'created_tests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'tests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    /**
     * @var Collection<int, Question>
     */
    #[ORM\OneToMany(targetEntity: Question::class, mappedBy: 'test', orphanRemoval: true)]
    private Collection $questions;

    /**
     * @var Collection<int, TestResult>
     */
    #[ORM\OneToMany(targetEntity: TestResult::class, mappedBy: 'test')]
    private Collection $testResults;

    /**
     * @var Collection<int, TestAssignment>
     */
    #[ORM\OneToMany(targetEntity: TestAssignment::class, mappedBy: 'test', orphanRemoval: true)]
    private Collection $classAssignments;

    /**
     * @var Collection<int, TestTag>
     */
    #[ORM\OneToMany(targetEntity: TestTag::class, mappedBy: 'test', orphanRemoval: true)]
    private Collection $tagRelations;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
        $this->testResults = new ArrayCollection();
        $this->classAssignments = new ArrayCollection();
        $this->tagRelations = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->created_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    /**
     * @return Collection<int, Question>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): static
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setTest($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): static
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getTest() === $this) {
                $question->setTest(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TestResult>
     */
    public function getTestResults(): Collection
    {
        return $this->testResults;
    }

    public function addTestResult(TestResult $testResult): static
    {
        if (!$this->testResults->contains($testResult)) {
            $this->testResults->add($testResult);
            $testResult->setTest($this);
        }

        return $this;
    }

    public function removeTestResult(TestResult $testResult): static
    {
        if ($this->testResults->removeElement($testResult)) {
            // set the owning side to null (unless already changed)
            if ($testResult->getTest() === $this) {
                $testResult->setTest(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TestAssignment>
     */
    public function getClassAssignments(): Collection
    {
        return $this->classAssignments;
    }

    public function addClassAssignment(TestAssignment $testAssignment): static
    {
        if (!$this->classAssignments->contains($testAssignment)) {
            $this->classAssignments->add($testAssignment);
            $testAssignment->setTest($this);
        }

        return $this;
    }

    public function removeClassAssignment(TestAssignment $testAssignment): static
    {
        if ($this->classAssignments->removeElement($testAssignment)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }

    /**
     * @return Collection<int, TestTag>
     */
    public function getTagRelations(): Collection
    {
        return $this->tagRelations;
    }

    public function addTagRelation(TestTag $testTag): static
    {
        if (!$this->tagRelations->contains($testTag)) {
            $this->tagRelations->add($testTag);
            $testTag->setTest($this);
        }

        return $this;
    }

    public function removeTagRelation(TestTag $testTag): static
    {
        if ($this->tagRelations->removeElement($testTag)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }
}
