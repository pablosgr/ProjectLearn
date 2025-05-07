<?php

namespace App\Entity;

use App\Repository\TagRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: TagRepository::class)]
class Tag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $name = null;

    /**
     * @var Collection<int, TestTag>
     */
    #[ORM\OneToMany(targetEntity: TestTag::class, mappedBy: 'tag', orphanRemoval: true)]
    private Collection $testRelations;

    public function __construct()
    {
        $this->testRelations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, TestTag>
     */
    public function getTestRelations(): Collection
    {
        return $this->testRelations;
    }

    public function addTestRelation(TestTag $testTag): static
    {
        if (!$this->testRelations->contains($testTag)) {
            $this->testRelations->add($testTag);
            $testTag->setTag($this);
        }

        return $this;
    }

    public function removeTestRelation(TestTag $testTag): static
    {
        if ($this->testRelations->removeElement($testTag)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }
}
